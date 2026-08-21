// Core VeriFlow Domain Entity Definitions

export type UserRole = 'CITIZEN' | 'AUTHORITY';

export type CaseStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'CLAIMED_RESOLVED'
  | 'VERIFYING'
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'REJECTED'
  | 'INSUFFICIENT_EVIDENCE'
  | 'HUMAN_REVIEW';

export type EvidenceType = 'ORIGINAL_REPORT' | 'RESOLUTION_PROOF';

export type VerificationRunStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type VerificationDecision =
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'REJECTED'
  | 'INSUFFICIENT_EVIDENCE'
  | 'HUMAN_REVIEW';

export type FindingStatus = 'PASSED' | 'FAILED' | 'WARNING' | 'INCONCLUSIVE';

export type FindingCategory =
  | 'EVIDENCE_QUALITY'
  | 'METADATA'
  | 'SPATIAL'
  | 'VISUAL_DELTA'
  | 'TIMELINE';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  department?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EvidenceMetadata {
  gps?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  timestamp?: string;
  camera_make?: string;
  camera_model?: string;
  width?: number;
  height?: number;
  hash?: string;
  [key: string]: unknown;
}

export interface EvidenceItem {
  id: string;
  case_id: string;
  uploaded_by: string;
  type: EvidenceType;
  file_url: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  metadata_json: EvidenceMetadata;
  created_at: string;
}

export interface VerificationFinding {
  id: string;
  run_id: string;
  category: FindingCategory;
  check_name: string;
  status: FindingStatus;
  confidence: number; // Evidence-support confidence rating [0.0 - 1.0]
  explanation: string;
  metadata_json?: Record<string, unknown>;
  created_at: string;
}

export interface VerificationRun {
  id: string;
  case_id: string;
  status: VerificationRunStatus;
  overall_decision?: VerificationDecision;
  overall_confidence?: number; // Evidence-support confidence (not a calibrated probability)
  summary?: string;
  recommended_next_action?: string;
  findings: VerificationFinding[];
  created_at: string;
  completed_at?: string;
}

export interface AuditLog {
  id: string;
  case_id: string;
  actor_id?: string;
  action: string;
  previous_state?: string;
  new_state?: string;
  details_json?: Record<string, unknown>;
  created_at: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  location_text: string;
  latitude?: number;
  longitude?: number;
  status: CaseStatus;
  created_by: string;
  assigned_authority_id?: string;
  created_at: string;
  updated_at: string;
  original_evidence?: EvidenceItem[];
  resolution_evidence?: EvidenceItem[];
  latest_verification_run?: VerificationRun;
  audit_logs?: AuditLog[];
}
