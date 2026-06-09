export class WebsiteAnalysisUnavailableError extends Error {
  readonly reason: string;

  constructor(reason: string) {
    super(`Website analysis unavailable: ${reason}`);
    this.name = "WebsiteAnalysisUnavailableError";
    this.reason = reason;
  }
}
