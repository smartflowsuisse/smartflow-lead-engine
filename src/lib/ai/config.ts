export type AiProvider = "openai" | "anthropic";

export interface AiConfig {
  enabled: boolean;
  provider: AiProvider;
  model: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  timeoutMs: number;
  maxExcerptChars: number;
  maxQuickWins: number;
  maxAutomationOps: number;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function isAiAnalysisEnabled(): boolean {
  return process.env.AI_ANALYSIS_ENABLED === "true";
}

export function getAiConfig(): AiConfig {
  const provider =
    process.env.AI_PROVIDER === "anthropic" ? "anthropic" : "openai";

  return {
    enabled: isAiAnalysisEnabled(),
    provider,
    model: process.env.AI_MODEL ?? "gpt-4o-mini",
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    timeoutMs: parsePositiveInt(process.env.AI_REQUEST_TIMEOUT_MS, 25_000),
    maxExcerptChars: parsePositiveInt(process.env.AI_MAX_HTML_EXCERPT_CHARS, 8_000),
    maxQuickWins: parsePositiveInt(process.env.AI_MAX_QUICK_WINS, 8),
    maxAutomationOps: parsePositiveInt(process.env.AI_MAX_AUTOMATION_OPS, 6),
  };
}

export function hasAiCredentials(config: AiConfig = getAiConfig()): boolean {
  if (!config.enabled) return false;
  if (config.provider === "anthropic") {
    return Boolean(config.anthropicApiKey?.trim());
  }
  return Boolean(config.openaiApiKey?.trim());
}
