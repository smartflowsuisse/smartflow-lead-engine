export const CONVERT_TO_CLIENT_ALLOWED_STATUSES = [
  "Won",
  "closed-won",
  "client-won",
] as const;

export type ConvertToClientAllowedStatus =
  (typeof CONVERT_TO_CLIENT_ALLOWED_STATUSES)[number];

export type ConvertToClientContractLeadInput = {
  id: string;
  company: string;
  status: string;
  contactName?: string;
  email?: string;
  phone?: string;
  language?: string;
};

export type ConvertToClientContractClientDraft = {
  id: string;
  sourceLeadId: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  language: string;
  status: "Draft";
};

export type ConvertToClientAuditAction =
  | "convert_to_client_preview"
  | "convert_to_client_approved"
  | "convert_to_client_blocked";

export type ConvertToClientAuditResult = "prepared" | "approved" | "blocked";

export type ConvertToClientAuditEvent = {
  id: string;
  sourceLeadId: string;
  generatedClientId: string;
  actor: string;
  timestamp: string;
  action: ConvertToClientAuditAction;
  previousLeadStatus: string;
  newLeadStatus?: string;
  result: ConvertToClientAuditResult;
  rollbackAvailable: boolean;
  note: string;
};

export type ConvertToClientDuplicateCheck = {
  sourceLeadId: string;
  company: string;
  email?: string;
};

export type ConvertToClientRollbackContext = {
  sourceLeadId: string;
  generatedClientId: string;
  previousLeadStatus: string;
  actor: string;
  timestamp: string;
  persistedRecordCreated: boolean;
};

export const CONVERT_TO_CLIENT_BLOCKED_EXTERNAL_ACTIONS = [
  "database-write",
  "lead-status-update",
  "gmail-draft",
  "email-send",
  "make-scenario",
  "openai-call",
  "external-notification",
] as const;

export const CONVERT_TO_CLIENT_REQUIRED_TESTS = [
  "won-lead-produces-client-draft",
  "non-won-lead-is-blocked",
  "optional-fields-use-safe-defaults",
  "duplicate-source-lead-is-blocked",
  "audit-event-is-generated",
  "rollback-context-is-present",
  "no-external-action-is-triggered",
] as const;
