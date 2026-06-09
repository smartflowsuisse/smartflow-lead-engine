export const LEAD_STATUSES = [
  "New Lead",
  "Analyzed",
  "Contacted",
  "Follow Up",
  "Proposal Sent",
  "Client",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

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
  notes: string | null;
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
  notes?: string;
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
