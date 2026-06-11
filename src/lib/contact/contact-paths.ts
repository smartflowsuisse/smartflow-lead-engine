export const CONTACT_PAGE_PATHS = [
  "/contact",
  "/kontakt",
  "/contact-us",
  "/kontakt.html",
  "/contact.html",
  "/about",
  "/about-us",
  "/ueber-uns",
  "/impressum",
  "/imprint",
  "/datenschutz",
  "/privacy",
  "/mentions-legales",
  "/contactez-nous",
  "/nous-contacter",
  "/fr/contact",
  "/fr/kontakt",
  "/de/kontakt",
  "/de/contact",
  "/legal",
] as const;

const CONTACT_URL_KEYWORDS = [
  "contact",
  "kontakt",
  "impressum",
  "imprint",
  "about",
  "datenschutz",
  "privacy",
  "contactez",
  "contacter",
  "mentions-legales",
  "ueber-uns",
  "about-us",
  "contact-us",
  "legal",
  "nous-contacter",
];

const NON_HTML_EXTENSIONS = [
  ".css",
  ".js",
  ".mjs",
  ".cjs",
  ".map",
  ".json",
  ".xml",
  ".txt",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".pdf",
  ".zip",
  ".mp4",
  ".webm",
  ".avif",
];

const ASSET_PATH_PATTERNS = [
  /\/wp-content\//i,
  /\/wp-includes\//i,
  /\/plugins\//i,
  /\/node_modules\//i,
  /\/_next\/static\//i,
  /\/assets\//i,
  /\/static\//i,
  /\/dist\//i,
  /\/cdn\//i,
];

function pathnameExtension(pathname: string): string | null {
  const lastSegment = pathname.split("/").pop() ?? "";
  const dotIndex = lastSegment.lastIndexOf(".");
  if (dotIndex <= 0) {
    return null;
  }

  return lastSegment.slice(dotIndex).toLowerCase();
}

export function isHtmlPageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;

    const extension = pathnameExtension(pathname);
    if (extension && NON_HTML_EXTENSIONS.includes(extension)) {
      return false;
    }

    if (ASSET_PATH_PATTERNS.some((pattern) => pattern.test(pathname))) {
      return false;
    }

    return true;
  } catch {
    const lower = url.toLowerCase();
    return !NON_HTML_EXTENSIONS.some((extension) => lower.includes(extension));
  }
}

function pathnameMatchesContactKeyword(pathname: string): boolean {
  const lowerPath = pathname.toLowerCase();
  return CONTACT_URL_KEYWORDS.some((keyword) => {
    const pattern = new RegExp(`(^|/)${keyword.replace(/-/g, "[-_]")}([/?#]|$)`, "i");
    return pattern.test(lowerPath);
  });
}

export function isContactLikeUrl(url: string): boolean {
  if (!isHtmlPageUrl(url)) {
    return false;
  }

  try {
    const pathname = new URL(url).pathname;
    return pathnameMatchesContactKeyword(pathname);
  } catch {
    return CONTACT_URL_KEYWORDS.some((keyword) =>
      url.toLowerCase().includes(keyword)
    );
  }
}
