"use strict";
/**
 * VeriFlow Evidence Quality Validation Layer
 *
 * Performs deterministic pre-verification validation of evidence quality, format integrity,
 * resolution adequacy, coverage, duplicate detection, and readability before routing
 * to full verification or AI analysis.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEvidenceQuality = validateEvidenceQuality;
var SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
var MIN_IMAGE_WIDTH = 600;
var MIN_IMAGE_HEIGHT = 450;
var MIN_FILE_SIZE_BYTES = 10 * 1024; // 10 KB
function validateEvidenceQuality(runId, originalEvidence, resolutionEvidence) {
    var findings = [];
    var passedAllCritical = true;
    var isInsufficient = false;
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
    }
    else {
        findings.push({
            id: crypto.randomUUID(),
            run_id: runId,
            category: 'EVIDENCE_QUALITY',
            check_name: 'Original Evidence Presence',
            status: 'PASSED',
            confidence: 1.0,
            explanation: "Found ".concat(originalEvidence.length, " item(s) of original report evidence."),
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
    }
    else {
        findings.push({
            id: crypto.randomUUID(),
            run_id: runId,
            category: 'EVIDENCE_QUALITY',
            check_name: 'Resolution Evidence Presence',
            status: 'PASSED',
            confidence: 1.0,
            explanation: "Found ".concat(resolutionEvidence.length, " item(s) of resolution proof evidence."),
            created_at: new Date().toISOString(),
        });
    }
    var allEvidence = __spreadArray(__spreadArray([], (originalEvidence || []), true), (resolutionEvidence || []), true);
    // Rule 3: File Type and Integrity
    for (var _i = 0, allEvidence_1 = allEvidence; _i < allEvidence_1.length; _i++) {
        var item = allEvidence_1[_i];
        var isSupported = SUPPORTED_MIME_TYPES.includes(item.mime_type.toLowerCase());
        if (!isSupported) {
            findings.push({
                id: crypto.randomUUID(),
                run_id: runId,
                category: 'EVIDENCE_QUALITY',
                check_name: "MIME Format Check (".concat(item.type, ")"),
                status: 'FAILED',
                confidence: 0.95,
                explanation: "Evidence file format ".concat(item.mime_type, " is unsupported. Allowed: JPEG, PNG, WEBP, HEIC."),
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
                check_name: "File Size Adequacy (".concat(item.type, ")"),
                status: 'FAILED',
                confidence: 0.9,
                explanation: "Evidence file size (".concat(Math.round(item.file_size / 1024), "KB) is too small to contain legible details."),
                created_at: new Date().toISOString(),
            });
            passedAllCritical = false;
            isInsufficient = true;
        }
    }
    // Rule 4: Image Resolution Adequacy
    for (var _a = 0, allEvidence_2 = allEvidence; _a < allEvidence_2.length; _a++) {
        var item = allEvidence_2[_a];
        if (item.width && item.height) {
            if (item.width < MIN_IMAGE_WIDTH || item.height < MIN_IMAGE_HEIGHT) {
                findings.push({
                    id: crypto.randomUUID(),
                    run_id: runId,
                    category: 'EVIDENCE_QUALITY',
                    check_name: "Resolution Adequacy (".concat(item.type, ")"),
                    status: 'WARNING',
                    confidence: 0.85,
                    explanation: "Image resolution ".concat(item.width, "x").concat(item.height, " is below recommended minimum (").concat(MIN_IMAGE_WIDTH, "x").concat(MIN_IMAGE_HEIGHT, "). May impact visual verification accuracy."),
                    created_at: new Date().toISOString(),
                });
            }
            else {
                findings.push({
                    id: crypto.randomUUID(),
                    run_id: runId,
                    category: 'EVIDENCE_QUALITY',
                    check_name: "Resolution Adequacy (".concat(item.type, ")"),
                    status: 'PASSED',
                    confidence: 1.0,
                    explanation: "Image resolution ".concat(item.width, "x").concat(item.height, " meets quality standards."),
                    created_at: new Date().toISOString(),
                });
            }
        }
    }
    // Rule 5: Duplicate Evidence Detection
    var fileHashes = new Set();
    var filePaths = new Set();
    for (var _b = 0, allEvidence_3 = allEvidence; _b < allEvidence_3.length; _b++) {
        var item = allEvidence_3[_b];
        var identifier = item.metadata_json.hash || item.storage_path;
        if (fileHashes.has(identifier) || filePaths.has(item.storage_path)) {
            findings.push({
                id: crypto.randomUUID(),
                run_id: runId,
                category: 'EVIDENCE_QUALITY',
                check_name: 'Duplicate Evidence Detection',
                status: 'FAILED',
                confidence: 1.0,
                explanation: "Identical evidence file uploaded multiple times (".concat(item.storage_path, ")."),
                created_at: new Date().toISOString(),
            });
            passedAllCritical = false;
            isInsufficient = true;
        }
        fileHashes.add(identifier);
        filePaths.add(item.storage_path);
    }
    // Rule 6: Visual Coverage Adequacy
    if ((originalEvidence === null || originalEvidence === void 0 ? void 0 : originalEvidence.length) && (resolutionEvidence === null || resolutionEvidence === void 0 ? void 0 : resolutionEvidence.length)) {
        var totalCount = originalEvidence.length + resolutionEvidence.length;
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
        }
        else {
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
        findings: findings,
        isInsufficient: isInsufficient,
        reason: isInsufficient ? 'Evidence failed quality, resolution, format, or completeness requirements.' : undefined,
    };
}
