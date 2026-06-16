import {
  templatePackRegistry,
  type TemplatePackId,
} from "@/lib/templates/template-pack-registry";

export function isTemplatePackId(
  value: string | null | undefined,
): value is TemplatePackId {
  return typeof value === "string" && value in templatePackRegistry;
}

export function getTemplatePackContext(value: string | null | undefined) {
  if (!isTemplatePackId(value)) {
    return null;
  }

  return templatePackRegistry[value];
}
