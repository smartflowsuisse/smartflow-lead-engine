export const LEAD_STATUSES = [
  "New",
  "Analyzed",
  "Contacted",
  "Replied",
  "Meeting",
  "Proposal",
  "Won",
  "Lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const OUTREACH_STATUSES = [
  "New",
  "Contacted",
  "Replied",
  "Meeting",
  "Won",
  "Lost",
] as const;

export type OutreachStatus = (typeof OUTREACH_STATUSES)[number];

export interface Lead {
  id: number;
  company: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  industry: string | null;
  lead_score: number;
  status: LeadStatus;
  outreach_status: OutreachStatus;
  notes: string | null;
  contacted_at: string | null;
  contacted_language: string | null;
  contact_page_url: string | null;
  email_confidence: number | null;
  phone_confidence: number | null;
  created_at: string;
  updated_at: string;
}

export interface LeadAnalysis {
  id: number;
  lead_id: number;
  website_quality: number | null;
  mobile_friendliness: number | null;
  speed_score: number | null;
  seo_score: number | null;
  has_contact_form: boolean | null;
  trust_score: number | null;
  quick_wins: string;
  automation_opportunities: string;
  raw_analysis: string;
  analyzed_at: string;
}

export interface CreateLeadInput {
  company: string;
  website?: string;
  email?: string;
  phone?: string;
  city?: string;
  industry?: string;
  status?: LeadStatus;
  notes?: string;
}

export interface UpdateLeadInput {
  company?: string;
  website?: string;
  email?: string;
  phone?: string;
  city?: string;
  industry?: string;
  lead_score?: number;
  status?: LeadStatus;
  outreach_status?: OutreachStatus;
  notes?: string;
  contact_page_url?: string;
  email_confidence?: number;
  phone_confidence?: number;
}

export interface DashboardStats {
  totalLeads: number;
  byStatus: Record<LeadStatus, number>;
  averageScore: number;
  analyzedCount: number;
  conversionRate: number;
  highPriorityLeads: number;
  recentLeads: Lead[];
}

export type AnalysisEngine = "heuristic" | "heuristic+llm";

export type AnalysisMode = "live" | "unavailable";

export interface WebsiteAnalysisResult {
  websiteQuality: number | null;
  mobileFriendliness: number | null;
  speedScore: number | null;
  seoScore: number | null;
  hasContactForm: boolean | null;
  trustScore: number | null;
  quickWins: string[];
  automationOpportunities: string[];
  details: Record<string, unknown> & {
    mode?: AnalysisMode;
    analysisEngine?: AnalysisEngine;
    summary?: string;
    salesAngle?: string;
    aiSkippedReason?: string;
    unavailableReason?: string;
    websiteQualityScore?: number | null;
    opportunityScore?: number;
    speedUnavailableReason?: string;
  };
}

export interface LeadAnalysisContext {
  company?: string;
  city?: string | null;
  industry?: string | null;
  website?: string;
}

export interface LeadSearchFilters {
  q?: string;
  status?: LeadStatus;
}

export interface LeadWithAnalysis extends Lead {
  analysis?: LeadAnalysis | null;
}

export interface LeadTask {
  id: number;
  lead_id: number;
  title: string;
  due_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadTaskInput {
  title: string;
  due_date: string;
}

export interface UpdateLeadTaskInput {
  title?: string;
  due_date?: string;
  completed?: boolean;
}

export type LeadActivityType =
  | "analysis_completed"
  | "outreach_generated"
  | "contacted"
  | "contact_discovered";

export interface LeadActivity {
  id: number;
  lead_id: number;
  activity_type: LeadActivityType;
  details: Record<string, unknown>;
  created_at: string;
}
