"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationEngine = void 0;
var quality_1 = require("./quality");
var visionService_1 = require("../ai/visionService");
/**
 * Calculates distance in meters between two lat/lng coordinates (Haversine formula).
 */
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // Earth radius in meters
    var rad = Math.PI / 180;
    var dLat = (lat2 - lat1) * rad;
    var dLon = (lon2 - lon1) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
var VerificationEngine = /** @class */ (function () {
    function VerificationEngine() {
    }
    VerificationEngine.executeVerification = function (targetCase, originalEvidence, resolutionEvidence) {
        return __awaiter(this, void 0, void 0, function () {
            var runId, findings, qualityResult, origEarliest, resLatest, resGpsItem, origGpsItem, targetLat, targetLng, resLat, resLng, distanceMeters, visualSupportConfidence, visualIsResolved, visualFailed, visualLevel, visionService, visionResult, err_1, baseScore, failedFindings, warningFindings, inconclusiveFindings, finalSupport, decision, summaryText, nextAction, criticalFailures;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        runId = crypto.randomUUID();
                        findings = [];
                        qualityResult = (0, quality_1.validateEvidenceQuality)(runId, originalEvidence, resolutionEvidence);
                        findings.push.apply(findings, qualityResult.findings);
                        if (qualityResult.isInsufficient) {
                            return [2 /*return*/, this.finalizeRun(runId, targetCase.id, 'INSUFFICIENT_EVIDENCE', 0.2, 'Verification halted: Evidence submitted does not meet minimum quality, resolution, format, or completeness standards.', 'Request authority or citizen to re-upload clear, high-resolution original and resolution evidence with valid format.', findings)];
                        }
                        origEarliest = originalEvidence.reduce(function (earliest, item) {
                            var _a;
                            var ts = ((_a = item.metadata_json) === null || _a === void 0 ? void 0 : _a.timestamp) ? new Date(item.metadata_json.timestamp).getTime() : new Date(item.created_at).getTime();
                            return ts < earliest ? ts : earliest;
                        }, Infinity);
                        resLatest = resolutionEvidence.reduce(function (latest, item) {
                            var _a;
                            var ts = ((_a = item.metadata_json) === null || _a === void 0 ? void 0 : _a.timestamp) ? new Date(item.metadata_json.timestamp).getTime() : new Date(item.created_at).getTime();
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
                        }
                        else {
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
                        resGpsItem = resolutionEvidence.find(function (item) { var _a, _b, _c, _d; return ((_b = (_a = item.metadata_json) === null || _a === void 0 ? void 0 : _a.gps) === null || _b === void 0 ? void 0 : _b.latitude) && ((_d = (_c = item.metadata_json) === null || _c === void 0 ? void 0 : _c.gps) === null || _d === void 0 ? void 0 : _d.longitude); });
                        origGpsItem = originalEvidence.find(function (item) { var _a, _b, _c, _d; return ((_b = (_a = item.metadata_json) === null || _a === void 0 ? void 0 : _a.gps) === null || _b === void 0 ? void 0 : _b.latitude) && ((_d = (_c = item.metadata_json) === null || _c === void 0 ? void 0 : _c.gps) === null || _d === void 0 ? void 0 : _d.longitude); });
                        if (resGpsItem && (origGpsItem || (targetCase.latitude && targetCase.longitude))) {
                            targetLat = (_a = origGpsItem === null || origGpsItem === void 0 ? void 0 : origGpsItem.metadata_json.gps.latitude) !== null && _a !== void 0 ? _a : targetCase.latitude;
                            targetLng = (_b = origGpsItem === null || origGpsItem === void 0 ? void 0 : origGpsItem.metadata_json.gps.longitude) !== null && _b !== void 0 ? _b : targetCase.longitude;
                            resLat = resGpsItem.metadata_json.gps.latitude;
                            resLng = resGpsItem.metadata_json.gps.longitude;
                            distanceMeters = calculateDistanceMeters(targetLat, targetLng, resLat, resLng);
                            if (distanceMeters > 250) { // Allowed 250m tolerance for urban cell/GPS variance
                                findings.push({
                                    id: crypto.randomUUID(),
                                    run_id: runId,
                                    category: 'SPATIAL',
                                    check_name: 'GPS Spatial Match',
                                    status: 'FAILED',
                                    confidence: 0.9,
                                    explanation: "Resolution photo GPS coordinate location is ".concat(Math.round(distanceMeters), " meters away from reported issue site."),
                                    metadata_json: { distanceMeters: distanceMeters, resLat: resLat, resLng: resLng, targetLat: targetLat, targetLng: targetLng },
                                    created_at: new Date().toISOString(),
                                });
                            }
                            else {
                                findings.push({
                                    id: crypto.randomUUID(),
                                    run_id: runId,
                                    category: 'SPATIAL',
                                    check_name: 'GPS Spatial Match',
                                    status: 'PASSED',
                                    confidence: 0.95,
                                    explanation: "Resolution photo GPS location matches issue site within ".concat(Math.round(distanceMeters), " meters tolerance."),
                                    metadata_json: { distanceMeters: distanceMeters },
                                    created_at: new Date().toISOString(),
                                });
                            }
                        }
                        else {
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
                        visualSupportConfidence = 0.5;
                        visualIsResolved = false;
                        visualFailed = false;
                        visualLevel = 'INCONCLUSIVE';
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        visionService = new visionService_1.VisionService();
                        return [4 /*yield*/, visionService.analyzeResolutionDelta({
                                originalEvidence: originalEvidence,
                                resolutionEvidence: resolutionEvidence,
                                category: targetCase.category,
                                caseDescription: targetCase.description,
                            })];
                    case 2:
                        visionResult = _e.sent();
                        visualSupportConfidence = visionResult.supportConfidence;
                        visualIsResolved = visionResult.isResolved;
                        visualLevel = ((_c = visionResult.rawModelResponse) === null || _c === void 0 ? void 0 : _c.resolutionLevel) || 'INCONCLUSIVE';
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
                                residualDamage: (_d = visionResult.rawModelResponse) === null || _d === void 0 ? void 0 : _d.residualDamage,
                            },
                            created_at: new Date().toISOString(),
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _e.sent();
                        console.warn('AI Vision Analysis failed or unavailable:', err_1.message);
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
                        return [3 /*break*/, 4];
                    case 4:
                        baseScore = 1.0;
                        failedFindings = findings.filter(function (f) { return f.status === 'FAILED'; });
                        warningFindings = findings.filter(function (f) { return f.status === 'WARNING'; });
                        inconclusiveFindings = findings.filter(function (f) { return f.status === 'INCONCLUSIVE'; });
                        if (failedFindings.some(function (f) { return f.category === 'TIMELINE'; }))
                            baseScore -= 0.4;
                        if (failedFindings.some(function (f) { return f.category === 'SPATIAL'; }))
                            baseScore -= 0.3;
                        if (inconclusiveFindings.some(function (f) { return f.category === 'SPATIAL'; }))
                            baseScore -= 0.1;
                        finalSupport = baseScore * visualSupportConfidence;
                        if (finalSupport < 0)
                            finalSupport = 0;
                        if (finalSupport > 1)
                            finalSupport = 1;
                        decision = 'HUMAN_REVIEW';
                        summaryText = '';
                        nextAction = '';
                        criticalFailures = failedFindings.filter(function (f) { return f.category !== 'VISUAL_DELTA'; });
                        if (criticalFailures.length > 0) {
                            decision = 'REJECTED';
                            summaryText = "Claim verification rejected due to critical deterministic failures: ".concat(criticalFailures.map(function (f) { return f.check_name; }).join(', '), ".");
                            nextAction = 'Reject resolution claim / reopen case';
                        }
                        else if (visualFailed) {
                            decision = 'HUMAN_REVIEW';
                            summaryText = "Deterministic validation passed, but visual analysis was unavailable.";
                            nextAction = 'Route to reviewer';
                        }
                        else if (visualIsResolved && warningFindings.length === 0) {
                            decision = 'VERIFIED';
                            summaryText = 'Evidence supports complete resolution. Visual and metadata checks passed successfully.';
                            nextAction = 'Approve resolution';
                        }
                        else if (visualLevel === 'PARTIAL') {
                            decision = 'PARTIALLY_VERIFIED';
                            summaryText = 'The resolution evidence corresponds to the reported issue, but residual damage or incomplete resolution was detected visually.';
                            nextAction = 'Request updated evidence / reopen case';
                        }
                        else if (!visualIsResolved && visualLevel === 'NONE') {
                            decision = 'REJECTED';
                            summaryText = 'Visual analysis indicates the issue has not been resolved in the provided evidence.';
                            nextAction = 'Reject resolution claim / reopen case';
                        }
                        else {
                            decision = 'HUMAN_REVIEW';
                            summaryText = "Verification requires human review due to ambiguous evidence or warnings (".concat(warningFindings.length + inconclusiveFindings.length, " advisory findings).");
                            nextAction = 'Route to reviewer';
                        }
                        return [2 /*return*/, this.finalizeRun(runId, targetCase.id, decision, finalSupport, summaryText, nextAction, findings)];
                }
            });
        });
    };
    VerificationEngine.finalizeRun = function (runId, caseId, decision, confidence, summary, nextAction, findings) {
        var run = {
            id: runId,
            case_id: caseId,
            status: 'COMPLETED',
            overall_decision: decision,
            overall_confidence: confidence,
            summary: summary,
            recommended_next_action: nextAction,
            findings: findings,
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
        };
        return {
            run: run,
            newCaseStatus: decision,
            explanationSummary: summary,
            recommendedAction: nextAction,
        };
    };
    return VerificationEngine;
}());
exports.VerificationEngine = VerificationEngine;
