export function normalizeWebsite(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  try {
    const parsed = new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    );
    return parsed.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return trimmed
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .toLowerCase();
  }
}

export function normalizeCompany(name: string): string {
  return name.trim().toLowerCase();
}

export function getCandidateKey(candidate: {
  company: string;
  website: string;
}): string {
  const domain = normalizeWebsite(candidate.website);
  if (domain) return `domain:${domain}`;
  return `company:${normalizeCompany(candidate.company)}`;
}
