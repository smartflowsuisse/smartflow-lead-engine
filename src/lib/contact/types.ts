export interface ContactFieldMatch {
  value: string;
  confidence: number;
  source: string;
}

export interface ContactDiscoveryResult {
  email: ContactFieldMatch | null;
  phone: ContactFieldMatch | null;
  contactPageUrl: string | null;
  pagesCrawled: string[];
}

export interface LeadContactDiscovery {
  email_confidence: number | null;
  phone_confidence: number | null;
  contact_page_url: string | null;
}
