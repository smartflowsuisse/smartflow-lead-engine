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

export function isContactLikeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const target = `${parsed.pathname} ${parsed.href}`.toLowerCase();
    return CONTACT_URL_KEYWORDS.some((keyword) => target.includes(keyword));
  } catch {
    return CONTACT_URL_KEYWORDS.some((keyword) =>
      url.toLowerCase().includes(keyword)
    );
  }
}
