/**
 * VeriFlow AI Service Contracts & Interfaces
 * 
 * IMPORTANT ARCHITECTURAL DESIGN PRINCIPLES:
 * 1. These interfaces establish strict decoupling between the verification engine and future AI vision/geospatial model services.
 * 2. Real AI models (e.g., multimodal LLMs, visual embedding comparators, EXIF spatial analyzers) implement these contracts.
 * 3. Confidence values returned by implementations MUST represent evidence-support confidence ratings, 
 *    not calibrated statistical probabilities.
 * 4. The engine and UI consume these contracts without assuming specific model implementations.
 */

import { EvidenceItem } from '../domain/types';

export interface VisualDeltaAnalysisRequest {
  originalEvidence: EvidenceItem[];
  resolutionEvidence: EvidenceItem[];
  caseDescription: string;
  category: string;
}

export interface VisualDeltaAnalysisResult {
  isResolved: boolean;
  supportConfidence: number; // Evidence-support confidence rating [0.0 - 1.0]
  detectedChanges: string[];
  visualCoverageSufficient: boolean;
  explanation: string;
  rawModelResponse?: Record<string, unknown>;
}

export interface SpatialTemporalVerificationRequest {
  evidenceItem: EvidenceItem;
  expectedLocation: {
    latitude?: number;
    longitude?: number;
    locationText: string;
  };
  caseCreatedAt: string;
}

export interface SpatialTemporalVerificationResult {
  locationMatch: 'MATCH' | 'DISCREPANCY' | 'INCONCLUSIVE';
  temporalSequenceValid: boolean;
  supportConfidence: number; // Evidence-support confidence rating [0.0 - 1.0]
  explanations: string[];
}

export interface ClaimSynthesisRequest {
  caseTitle: string;
  caseCategory: string;
  qualityValidationPassed: boolean;
  visualDeltaResult?: VisualDeltaAnalysisResult;
  spatialTemporalResult?: SpatialTemporalVerificationResult;
}

export interface ClaimSynthesisResult {
  suggestedDecision: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'REJECTED' | 'INSUFFICIENT_EVIDENCE' | 'HUMAN_REVIEW';
  overallSupportConfidence: number;
  summaryReasoning: string;
  recommendedNextAction: string;
}

/**
 * Primary AI Multimodal Vision Service Contract
 */
export interface IVisualDeltaAnalyzer {
  analyzeResolutionDelta(request: VisualDeltaAnalysisRequest): Promise<VisualDeltaAnalysisResult>;
}

/**
 * Primary Geospatial EXIF & Location Verification Service Contract
 */
export interface ISpatialTemporalVerifier {
  verifySpatialTemporalIntegrity(request: SpatialTemporalVerificationRequest): Promise<SpatialTemporalVerificationResult>;
}

/**
 * Claim Synthesis & Decision Recommendation Contract
 */
export interface IClaimSynthesisService {
  synthesizeVerificationDecision(request: ClaimSynthesisRequest): Promise<ClaimSynthesisResult>;
}
