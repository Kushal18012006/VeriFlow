/**
 * VeriFlow Evidence Quality Validation Layer
 * 
 * Performs deterministic pre-verification validation of evidence quality, format integrity,
 * resolution adequacy, coverage, duplicate detection, and readability before routing
 * to full verification or AI analysis.
 */

import { EvidenceItem, VerificationFinding } from '../domain/types';

export interface QualityValidationResult {
  passed: boolean;
  findings: VerificationFinding[];
  isInsufficient: boolean;
  reason?: string;
}

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MIN_IMAGE_WIDTH = 600;
const MIN_IMAGE_HEIGHT = 450;
const MIN_FILE_SIZE_BYTES = 10 * 1024; // 10 KB

export function validateEvidenceQuality(
  runId: string,
  originalEvidence: EvidenceItem[],
  resolutionEvidence: EvidenceItem[]
): QualityValidationResult {
  const findings: VerificationFinding[] = [];
  let passedAllCritical = true;
  let isInsufficient = false;

  // Rule 1: Check presence of original evidence
  if (!originalEvidence || originalEvidence.length === 0) {
    findings.push({
      id: crypto.randomUUID(),
      run_id: runId,
      category: 'EVIDENCE_QUALITY',
      check_name: 'Original Evidence Presence',
      status: 'FAILED',
      confidence: 1.0,
      explanation: 'No original issue report evidence attached to case.',
      created_at: new Date().toISOString(),
    });
    passedAllCritical = false;
    isInsufficient = true;
  } else {
    findings.push({
      id: crypto.randomUUID(),
      run_id: runId,
      category: 'EVIDENCE_QUALITY',
      check_name: 'Original Evidence Presence',
      status: 'PASSED',
      confidence: 1.0,
      explanation: `Found ${originalEvidence.length} item(s) of original report evidence.`,
      created_at: new Date().toISOString(),
    });
  }

  // Rule 2: Check presence of resolution proof evidence
  if (!resolutionEvidence || resolutionEvidence.length === 0) {
    findings.push({
      id: crypto.randomUUID(),
      run_id: runId,
      category: 'EVIDENCE_QUALITY',
      check_name: 'Resolution Evidence Presence',
      status: 'FAILED',
      confidence: 1.0,
      explanation: 'No resolution proof evidence submitted by authority.',
      created_at: new Date().toISOString(),
    });
    passedAllCritical = false;
    isInsufficient = true;
  } else {
    findings.push({
      id: crypto.randomUUID(),
      run_id: runId,
      category: 'EVIDENCE_QUALITY',
      check_name: 'Resolution Evidence Presence',
      status: 'PASSED',
      confidence: 1.0,
      explanation: `Found ${resolutionEvidence.length} item(s) of resolution proof evidence.`,
      created_at: new Date().toISOString(),
    });
  }

  const allEvidence = [...(originalEvidence || []), ...(resolutionEvidence || [])];

  // Rule 3: File Type and Integrity
  for (const item of allEvidence) {
    const isSupported = SUPPORTED_MIME_TYPES.includes(item.mime_type.toLowerCase());
    if (!isSupported) {
      findings.push({
        id: crypto.randomUUID(),
        run_id: runId,
        category: 'EVIDENCE_QUALITY',
        check_name: `MIME Format Check (${item.type})`,
        status: 'FAILED',
        confidence: 0.95,
        explanation: `Evidence file format ${item.mime_type} is unsupported. Allowed: JPEG, PNG, WEBP, HEIC.`,
        created_at: new Date().toISOString(),
      });
      passedAllCritical = false;
      isInsufficient = true;
    }

    if (item.file_size < MIN_FILE_SIZE_BYTES) {
      findings.push({
        id: crypto.randomUUID(),
        run_id: runId,
        category: 'EVIDENCE_QUALITY',
        check_name: `File Size Adequacy (${item.type})`,
        status: 'FAILED',
        confidence: 0.9,
        explanation: `Evidence file size (${Math.round(item.file_size / 1024)}KB) is too small to contain legible details.`,
        created_at: new Date().toISOString(),
      });
      passedAllCritical = false;
      isInsufficient = true;
    }
  }

  // Rule 4: Image Resolution Adequacy
  for (const item of allEvidence) {
    if (item.width && item.height) {
      if (item.width < MIN_IMAGE_WIDTH || item.height < MIN_IMAGE_HEIGHT) {
        findings.push({
          id: crypto.randomUUID(),
          run_id: runId,
          category: 'EVIDENCE_QUALITY',
          check_name: `Resolution Adequacy (${item.type})`,
          status: 'WARNING',
          confidence: 0.85,
          explanation: `Image resolution ${item.width}x${item.height} is below recommended minimum (${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}). May impact visual verification accuracy.`,
          created_at: new Date().toISOString(),
        });
      } else {
        findings.push({
          id: crypto.randomUUID(),
          run_id: runId,
          category: 'EVIDENCE_QUALITY',
          check_name: `Resolution Adequacy (${item.type})`,
          status: 'PASSED',
          confidence: 1.0,
          explanation: `Image resolution ${item.width}x${item.height} meets quality standards.`,
          created_at: new Date().toISOString(),
        });
      }
    }
  }

  // Rule 5: Duplicate Evidence Detection
  const fileHashes = new Set<string>();
  const filePaths = new Set<string>();
  for (const item of allEvidence) {
    const identifier = item.metadata_json.hash || item.storage_path;
    if (fileHashes.has(identifier) || filePaths.has(item.storage_path)) {
      findings.push({
        id: crypto.randomUUID(),
        run_id: runId,
        category: 'EVIDENCE_QUALITY',
        check_name: 'Duplicate Evidence Detection',
        status: 'FAILED',
        confidence: 1.0,
        explanation: `Identical evidence file uploaded multiple times (${item.storage_path}).`,
        created_at: new Date().toISOString(),
      });
      passedAllCritical = false;
      isInsufficient = true;
    }
    fileHashes.add(identifier);
    filePaths.add(item.storage_path);
  }

  // Rule 6: Visual Coverage Adequacy
  if (originalEvidence?.length && resolutionEvidence?.length) {
    const totalCount = originalEvidence.length + resolutionEvidence.length;
    if (totalCount < 2) {
      findings.push({
        id: crypto.randomUUID(),
        run_id: runId,
        category: 'EVIDENCE_QUALITY',
        check_name: 'Visual Coverage Check',
        status: 'WARNING',
        confidence: 0.75,
        explanation: 'Only single angle provided for comparison. Multi-angle coverage recommended for conclusive verification.',
        created_at: new Date().toISOString(),
      });
    } else {
      findings.push({
        id: crypto.randomUUID(),
        run_id: runId,
        category: 'EVIDENCE_QUALITY',
        check_name: 'Visual Coverage Check',
        status: 'PASSED',
        confidence: 0.9,
        explanation: 'Multi-photo visual evidence provided for comparison.',
        created_at: new Date().toISOString(),
      });
    }
  }

  return {
    passed: passedAllCritical,
    findings,
    isInsufficient,
    reason: isInsufficient ? 'Evidence failed quality, resolution, format, or completeness requirements.' : undefined,
  };
}
