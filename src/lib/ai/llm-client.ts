import { extractJsonFromModelText, parseLlmEnrichmentResponse } from "./analysis-schema";
import { getAiConfig, hasAiCredentials, type AiConfig } from "./config";
import { AI_ANALYSIS_SYSTEM_PROMPT, buildEnrichmentUserPrompt } from "./prompts";
import type { EnrichmentInput, LlmEnrichmentResult } from "./types";

async function callOpenAi(
  config: AiConfig,
  userPrompt: string
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: AI_ANALYSIS_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return payload.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function callAnthropic(
  config: AiConfig,
  userPrompt: string
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.anthropicApiKey ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 1200,
        system: AI_ANALYSIS_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };

    const textBlock = payload.content?.find((block) => block.type === "text");
    return textBlock?.text ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function callLlmEnrichment(
  input: EnrichmentInput
): Promise<LlmEnrichmentResult | null> {
  const config = getAiConfig();
  if (!hasAiCredentials(config)) return null;

  const userPrompt = buildEnrichmentUserPrompt(input);
  const rawText =
    config.provider === "anthropic"
      ? await callAnthropic(config, userPrompt)
      : await callOpenAi(config, userPrompt);

  if (!rawText) return null;

  const json = extractJsonFromModelText(rawText);
  return parseLlmEnrichmentResponse(json);
}
