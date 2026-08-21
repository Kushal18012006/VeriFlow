/**
 * VeriFlow Deterministic Verification Engine
 * 
 * Executes evidence quality validation, metadata integrity checks, spatial-temporal
 * proximity checks, and timeline analysis to determine claim verification state.
 * 
 * DESIGN PRINCIPLE:
 * - NO FAKE AI OR MOCK CONFIDENCE GENERATION.
 * - Deterministic rules process verifiable metadata and evidence structure.
 * - AMBIGUOUS cases route directly to `HUMAN_REVIEW`.
 * - POOR/MISSING evidence routes to `INSUFFICIENT_EVIDENCE`.
 */

import { Case, EvidenceItem, VerificationRun, VerificationFinding, VerificationDecision } from '../domain/types';
import { validateEvidenceQuality } from './quality';
import { VisionService } from '../ai/visionService';

export interface VerificationExecutionResult {
  run: VerificationRun;
  newCaseStatus: Case['status'];
  explanationSummary: string;
  recommendedAction: string;
}

/**
 * Calculates distance in meters between two lat/lng coordinates (Haversine formula).
 */
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class VerificationEngine {
  public static async executeVerification(
    targetCase: Case,
    originalEvidence: EvidenceItem[],
    resolutionEvidence: EvidenceItem[]
  ): Promise<VerificationExecutionResult> {
    const runId = crypto.randomUUID();
    const findings: VerificationFinding[] = [];

    // STEP 1: Evidence Quality Validation Layer
    const qualityResult = validateEvidenceQuality(runId, originalEvidence, resolutionEvidence);
    findings.push(...qualityResult.findings);

    if (qualityResult.isInsufficient) {
      return this.finalizeRun(runId, targetCase.id, 'INSUFFICIENT_EVIDENCE', 0.2, 
        'Verification halted: Evidence submitted does not meet minimum quality, resolution, format, or completeness standards.',
        'Request authority or citizen to re-upload clear, high-resolution original and resolution evidence with valid format.',
        findings);
    }

    // STEP 2: Temporal Integrity Check
    const origEarliest = originalEvidence.reduce((earliest, item) => {
      const ts = item.metadata_json?.timestamp ? new Date(item.metadata_json.timestamp).getTime() : new Date(item.created_at).getTime();
      return ts < earliest ? ts : earliest;
    }, Infinity);

    const resLatest = resolutionEvidence.reduce((latest, item) => {
      const ts = item.metadata_json?.timestamp ? new Date(item.metadata_json.timestamp).getTime() : new Date(item.created_at).getTime();
      return ts > latest ? ts : latest;
    }, -Infinity);

    if (resLatest < origEarliest) {
      findings.push({
        id: crypto.randomUUID(),
        run_id: runId,
        category: 'TIMELINE',
        check_name: 'Temporal Order Verification',
        status: 'FAILED',
        confidence: 0.95,
        explanation: 'Resolution photo timestamp is earlier than the original issue report timestamp.',
        created_at: new Date().toISOString(),
      });
    } else {
      findings.push({
        id: crypto.randomUUID(),
        run_id: runId,
        category: 'TIMELINE',
        check_name: 'Temporal Order Verification',
        status: 'PASSED',
        confidence: 1.0,
        explanation: 'Resolution proof timestamp chronologically succeeds original issue report.',
        created_at: new Date().toISOString(),
      });
    }

    // STEP 3: Spatial / EXIF Location Check (if GPS available)
    const resGpsItem = resolutionEvidence.find(item => item.metadata_json?.gps?.latitude && item.metadata_json?.gps?.longitude);
    const origGpsItem = originalEvidence.find(item => item.metadata_json?.gps?.latitude && item.metadata_json?.gps?.longitude);

    if (resGpsItem && (origGpsItem || (targetCase.latitude && targetCase.longitude))) {
      const targetLat = origGpsItem?.metadata_json.gps!.latitude ?? targetCase.latitude!;
      const targetLng = origGpsItem?.metadata_json.gps!.longitude ?? targetCase.longitude!;
      const resLat = resGpsItem.metadata_json.gps!.latitude;
      const resLng = resGpsItem.metadata_json.gps!.longitude;

      const distanceMeters = calculateDistanceMeters(targetLat, targetLng, resLat, resLng);

      if (distanceMeters > 250) { // Allowed 250m tolerance for urban cell/GPS variance
        findings.push({
          id: crypto.randomUUID(),
          run_id: runId,
          category: 'SPATIAL',
          check_name: 'GPS Spatial Match',
          status: 'FAILED',
          confidence: 0.9,
          explanation: `Resolution photo GPS coordinate location is ${Math.round(distanceMeters)} meters away from reported issue site.`,
          metadata_json: { distanceMeters, resLat, resLng, targetLat, targetLng },
          created_at: new Date().toISOString(),
        });
      } else {
        findings.push({
          id: crypto.randomUUID(),
          run_id: runId,
          category: 'SPATIAL',
          check_name: 'GPS Spatial Match',
          status: 'PASSED',
          confidence: 0.95,
          explanation: `Resolution photo GPS location matches issue site within ${Math.round(distanceMeters)} meters tolerance.`,
          metadata_json: { distanceMeters },
          created_at: new Date().toISOString(),
        });
      }
    } else {
      findings.push({
        id: crypto.randomUUID(),
        run_id: runId,
        category: 'SPATIAL',
        check_name: 'GPS Spatial Match',
        status: 'INCONCLUSIVE',
        confidence: 0.5,
        explanation: 'EXIF GPS coordinates missing in evidence photos. Spatial proximity could not be verified automatically.',
        created_at: new Date().toISOString(),
      });
    }

    // STEP 4: AI Visual Delta Analysis
    let visualSupportConfidence = 0.5;
    let visualIsResolved = false;
    let visualFailed = false;
    let visualLevel = 'INCONCLUSIVE';

    try {
      const visionService = new VisionService();
      const visionResult = await visionService.analyzeResolutionDelta({
        originalEvidence,
        resolutionEvidence,
        category: targetCase.category,
        caseDescription: targetCase.description,
      });

      visualSupportConfidence = visionResult.supportConfidence;
      visualIsResolved = visionResult.isResolved;
      visualLevel = (visionResult.rawModelResponse?.resolutionLevel as string) || 'INCONCLUSIVE';

      findings.push({
        id: crypto.randomUUID(),
        run_id: runId,
        category: 'VISUAL_DELTA',
        check_name: 'Visual Resolution Match',
        status: visionResult.isResolved ? 'PASSED' : (visualLevel === 'PARTIAL' ? 'WARNING' : 'FAILED'),
        confidence: visionResult.supportConfidence,
        explanation: visionResult.explanation,
        metadata_json: {
          detectedChanges: visionResult.detectedChanges,
          visualCoverageSufficient: visionResult.visualCoverageSufficient,
          resolutionLevel: visualLevel,
          residualDamage: visionResult.rawModelResponse?.residualDamage,
        },
        created_at: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('AI Vision Analysis failed or unavailable:', err.message);
      visualFailed = true;
      findings.push({
        id: crypto.randomUUID(),
        run_id: runId,
        category: 'VISUAL_DELTA',
        check_name: 'Visual Resolution Match',
        status: 'INCONCLUSIVE',
        confidence: 0,
        explanation: 'AI visual analysis service unavailable or failed to process evidence. Human review required.',
        created_at: new Date().toISOString(),
      });
    }

    // STEP 5: Combine Findings & Calculate Overall Evidence Support
    // Score based on categories
    let baseScore = 1.0;
    const failedFindings = findings.filter(f => f.status === 'FAILED');
    const warningFindings = findings.filter(f => f.status === 'WARNING');
    const inconclusiveFindings = findings.filter(f => f.status === 'INCONCLUSIVE');

    if (failedFindings.some(f => f.category === 'TIMELINE')) baseScore -= 0.4;
    if (failedFindings.some(f => f.category === 'SPATIAL')) baseScore -= 0.3;
    if (inconclusiveFindings.some(f => f.category === 'SPATIAL')) baseScore -= 0.1;

    // Incorporate AI visual confidence heavily
    let finalSupport = baseScore * visualSupportConfidence;
    if (finalSupport < 0) finalSupport = 0;
    if (finalSupport > 1) finalSupport = 1;

    // STEP 6: Determine Final Decision & Routings
    let decision: VerificationDecision = 'HUMAN_REVIEW';
    let summaryText = '';
    let nextAction = '';

    const criticalFailures = failedFindings.filter(f => f.category !== 'VISUAL_DELTA');

    if (criticalFailures.length > 0) {
      decision = 'REJECTED';
      summaryText = `Claim verification rejected due to critical deterministic failures: ${criticalFailures.map(f => f.check_name).join(', ')}.`;
      nextAction = 'Reject resolution claim / reopen case';
    } else if (visualFailed) {
      decision = 'HUMAN_REVIEW';
      summaryText = `Deterministic validation passed, but visual analysis was unavailable.`;
      nextAction = 'Route to reviewer';
    } else if (visualIsResolved && warningFindings.length === 0) {
      decision = 'VERIFIED';
      summaryText = 'Evidence supports complete resolution. Visual and metadata checks passed successfully.';
      nextAction = 'Approve resolution';
    } else if (visualLevel === 'PARTIAL') {
      decision = 'PARTIALLY_VERIFIED';
      summaryText = 'The resolution evidence corresponds to the reported issue, but residual damage or incomplete resolution was detected visually.';
      nextAction = 'Request updated evidence / reopen case';
    } else if (!visualIsResolved && visualLevel === 'NONE') {
      decision = 'REJECTED';
      summaryText = 'Visual analysis indicates the issue has not been resolved in the provided evidence.';
      nextAction = 'Reject resolution claim / reopen case';
    } else {
      decision = 'HUMAN_REVIEW';
      summaryText = `Verification requires human review due to ambiguous evidence or warnings (${warningFindings.length + inconclusiveFindings.length} advisory findings).`;
      nextAction = 'Route to reviewer';
    }

    return this.finalizeRun(runId, targetCase.id, decision, finalSupport, summaryText, nextAction, findings);
  }

  private static finalizeRun(
    runId: string, 
    caseId: string, 
    decision: VerificationDecision, 
    confidence: number, 
    summary: string, 
    nextAction: string, 
    findings: VerificationFinding[]
  ): VerificationExecutionResult {
    const run: VerificationRun = {
      id: runId,
      case_id: caseId,
      status: 'COMPLETED',
      overall_decision: decision,
      overall_confidence: confidence,
      summary: summary,
      recommended_next_action: nextAction,
      findings,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    };

    return {
      run,
      newCaseStatus: decision,
      explanationSummary: summary,
      recommendedAction: nextAction,
    };
  }
}
