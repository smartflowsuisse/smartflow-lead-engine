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
  website_quality: number;
  mobile_friendliness: number;
  speed_score: number;
  seo_score: number;
  has_contact_form: boolean;
  trust_score: number;
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

export interface WebsiteAnalysisResult {
  websiteQuality: number;
  mobileFriendliness: number;
  speedScore: number;
  seoScore: number;
  hasContactForm: boolean;
  trustScore: number;
  quickWins: string[];
  automationOpportunities: string[];
  details: Record<string, unknown>;
}

export interface LeadWithAnalysis extends Lead {
  analysis?: LeadAnalysis | null;
}
