"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getAllCases = getAllCases;
exports.getCaseById = getCaseById;
exports.createNewCase = createNewCase;
exports.submitResolutionClaim = submitResolutionClaim;
var engine_1 = require("../verification/engine");
var supabase_js_1 = require("@supabase/supabase-js");
// Initial seed cases using valid PostgreSQL UUIDs
var INITIAL_SEED_CASES = [
    {
        id: 'c1111111-1111-1111-1111-111111111111',
        title: 'Severe Deep Pothole on 5th Ave Crossing',
        description: 'Hazardous 8-inch deep pothole in the left transit lane directly in front of pedestrian crosswalk.',
        category: 'POTHOLE',
        location_text: '5th Ave & Pine St Intersection, Downtown',
        latitude: 37.774929,
        longitude: -122.419416,
        status: 'CLAIMED_RESOLVED',
        created_by: '11111111-1111-1111-1111-111111111111',
        assigned_authority_id: '22222222-2222-2222-2222-222222222222',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        original_evidence: [
            {
                id: 'e1111111-1111-1111-1111-111111111111',
                case_id: 'c1111111-1111-1111-1111-111111111111',
                uploaded_by: '11111111-1111-1111-1111-111111111111',
                type: 'ORIGINAL_REPORT',
                file_url: '/demo/pothole_evidence.svg',
                storage_path: 'cases/c1111111-1111-1111-1111-111111111111/original_1.svg',
                mime_type: 'image/svg+xml',
                file_size: 485000,
                width: 1920,
                height: 1080,
                metadata_json: {
                    gps: { latitude: 37.774929, longitude: -122.419416 },
                    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
                    camera_make: 'Apple',
                    camera_model: 'iPhone 15 Pro',
                },
                created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            },
        ],
        resolution_evidence: [
            {
                id: 'e2222222-2222-2222-2222-222222222222',
                case_id: 'c1111111-1111-1111-1111-111111111111',
                uploaded_by: '22222222-2222-2222-2222-222222222222',
                type: 'RESOLUTION_PROOF',
                file_url: '/demo/pothole_repaired.svg',
                storage_path: 'cases/c1111111-1111-1111-1111-111111111111/resolution_1.svg',
                mime_type: 'image/svg+xml',
                file_size: 520000,
                width: 1920,
                height: 1080,
                metadata_json: {
                    gps: { latitude: 37.774935, longitude: -122.419420 },
                    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                    camera_make: 'Samsung',
                    camera_model: 'Galaxy S24 Ultra',
                },
                created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            },
        ],
        audit_logs: [
            {
                id: 'a1111111-1111-1111-1111-111111111111',
                case_id: 'c1111111-1111-1111-1111-111111111111',
                actor_id: '11111111-1111-1111-1111-111111111111',
                action: 'CASE_CREATED',
                new_state: 'OPEN',
                details_json: { notes: 'Citizen reported deep pothole hazard.' },
                created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            },
            {
                id: 'a2222222-2222-2222-2222-222222222222',
                case_id: 'c1111111-1111-1111-1111-111111111111',
                actor_id: '22222222-2222-2222-2222-222222222222',
                action: 'UNDER_REVIEW_ASSIGNED',
                previous_state: 'OPEN',
                new_state: 'UNDER_REVIEW',
                details_json: { department: 'Public Works Department' },
                created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
            {
                id: 'a3333333-3333-3333-3333-333333333333',
                case_id: 'c1111111-1111-1111-1111-111111111111',
                actor_id: '22222222-2222-2222-2222-222222222222',
                action: 'RESOLUTION_CLAIMED',
                previous_state: 'UNDER_REVIEW',
                new_state: 'CLAIMED_RESOLVED',
                details_json: { notes: 'Asphalt cold patch poured and compacted.' },
                created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            },
        ],
    },
    {
        id: 'c2222222-2222-2222-2222-222222222222',
        title: 'Broken Overhead Streetlight at Park Entrance',
        description: 'Main entrance security lamp knocked out following storm; area is unlit at night.',
        category: 'STREETLIGHT',
        location_text: 'Oak Park West Gate, North District',
        latitude: 37.7833,
        longitude: -122.4167,
        status: 'HUMAN_REVIEW',
        created_by: '11111111-1111-1111-1111-111111111111',
        assigned_authority_id: '22222222-2222-2222-2222-222222222222',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        original_evidence: [
            {
                id: 'e3333333-3333-3333-3333-333333333333',
                case_id: 'c2222222-2222-2222-2222-222222222222',
                uploaded_by: '11111111-1111-1111-1111-111111111111',
                type: 'ORIGINAL_REPORT',
                file_url: '/demo/streetlight_evidence.svg',
                storage_path: 'cases/c2222222-2222-2222-2222-222222222222/original_1.svg',
                mime_type: 'image/svg+xml',
                file_size: 310000,
                width: 1280,
                height: 720,
                metadata_json: {
                    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
                },
                created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
            },
        ],
        resolution_evidence: [
            {
                id: 'e4444444-4444-4444-4444-444444444444',
                case_id: 'c2222222-2222-2222-2222-222222222222',
                uploaded_by: '22222222-2222-2222-2222-222222222222',
                type: 'RESOLUTION_PROOF',
                file_url: '/demo/streetlight_repaired.svg',
                storage_path: 'cases/c2222222-2222-2222-2222-222222222222/resolution_1.svg',
                mime_type: 'image/svg+xml',
                file_size: 410000,
                width: 1280,
                height: 720,
                metadata_json: {
                    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
                },
                created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            },
        ],
        latest_verification_run: {
            id: 'r1111111-1111-1111-1111-111111111111',
            case_id: 'c2222222-2222-2222-2222-222222222222',
            status: 'COMPLETED',
            overall_decision: 'HUMAN_REVIEW',
            overall_confidence: 0.65,
            summary: 'Deterministic validation requires human review due to missing EXIF metadata or quality warnings (1 advisory finding(s)).',
            recommended_next_action: 'Flagged for human reviewer in authority queue to verify visual evidence manually.',
            findings: [
                {
                    id: 'f1111111-1111-1111-1111-111111111111',
                    run_id: 'r1111111-1111-1111-1111-111111111111',
                    category: 'EVIDENCE_QUALITY',
                    check_name: 'Original Evidence Presence',
                    status: 'PASSED',
                    confidence: 1.0,
                    explanation: 'Found 1 item(s) of original report evidence.',
                    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
                },
                {
                    id: 'f2222222-2222-2222-2222-222222222222',
                    run_id: 'r1111111-1111-1111-1111-111111111111',
                    category: 'SPATIAL',
                    check_name: 'GPS Spatial Match',
                    status: 'INCONCLUSIVE',
                    confidence: 0.5,
                    explanation: 'EXIF GPS coordinates missing in evidence photos. Spatial proximity could not be verified automatically.',
                    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
                },
            ],
            created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            completed_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        },
        audit_logs: [
            {
                id: 'a4444444-4444-4444-4444-444444444444',
                case_id: 'c2222222-2222-2222-2222-222222222222',
                actor_id: '11111111-1111-1111-1111-111111111111',
                action: 'CASE_CREATED',
                new_state: 'OPEN',
                created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
            },
            {
                id: 'a5555555-5555-5555-5555-555555555555',
                case_id: 'c2222222-2222-2222-2222-222222222222',
                actor_id: '22222222-2222-2222-2222-222222222222',
                action: 'VERIFICATION_EXECUTED',
                previous_state: 'CLAIMED_RESOLVED',
                new_state: 'HUMAN_REVIEW',
                details_json: { decision: 'HUMAN_REVIEW', confidence: 0.65 },
                created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            },
        ],
    },
    {
        id: 'c3333333-3333-3333-3333-333333333333',
        title: 'Clogged Storm Drain Flooding Sidewalk',
        description: 'Accumulated debris blocking stormwater inlet near school zone.',
        category: 'DRAINAGE',
        location_text: 'Elm Street & 12th Avenue',
        latitude: 37.769,
        longitude: -122.448,
        status: 'OPEN',
        created_by: '11111111-1111-1111-1111-111111111111',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        original_evidence: [
            {
                id: 'e5555555-5555-5555-5555-555555555555',
                case_id: 'c3333333-3333-3333-3333-333333333333',
                uploaded_by: '11111111-1111-1111-1111-111111111111',
                type: 'ORIGINAL_REPORT',
                file_url: '/demo/drainage_evidence.svg',
                storage_path: 'cases/c3333333-3333-3333-3333-333333333333/original_1.svg',
                mime_type: 'image/svg+xml',
                file_size: 510000,
                width: 1920,
                height: 1080,
                metadata_json: {
                    gps: { latitude: 37.769, longitude: -122.448 },
                    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
                },
                created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            },
        ],
        audit_logs: [
            {
                id: 'a6666666-6666-6666-6666-666666666666',
                case_id: 'c3333333-3333-3333-3333-333333333333',
                actor_id: '11111111-1111-1111-1111-111111111111',
                action: 'CASE_CREATED',
                new_state: 'OPEN',
                created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            },
        ],
    },
];
if (!globalThis._veriflow_cases_store) {
    globalThis._veriflow_cases_store = __spreadArray([], INITIAL_SEED_CASES, true);
}
var SERVER_CASES_STORE = globalThis._veriflow_cases_store;
function getSupabaseClient() {
    var url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    var key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key && url !== 'https://placeholder.supabase.co' && !url.includes('your-project')) {
        return (0, supabase_js_1.createClient)(url, key);
    }
    return null;
}
function getAllCases(params) {
    return __awaiter(this, void 0, void 0, function () {
        var supabase, query, _a, data, error, e_1, cases, q_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    supabase = getSupabaseClient();
                    if (!supabase) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    query = supabase.from('cases').select("\n        *,\n        original_evidence:evidence!case_id(*),\n        audit_logs:audit_logs!case_id(*),\n        verification_runs:verification_runs!case_id(*)\n      ");
                    if (params === null || params === void 0 ? void 0 : params.status)
                        query = query.eq('status', params.status);
                    if (params === null || params === void 0 ? void 0 : params.category)
                        query = query.eq('category', params.category);
                    if (params === null || params === void 0 ? void 0 : params.createdBy)
                        query = query.eq('created_by', params.createdBy);
                    return [4 /*yield*/, query];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (!error && data && data.length > 0) {
                        return [2 /*return*/, data.map(function (c) {
                                var _a, _b, _c;
                                return (__assign(__assign({}, c), { original_evidence: ((_a = c.original_evidence) === null || _a === void 0 ? void 0 : _a.filter(function (e) { return e.type === 'ORIGINAL_REPORT'; })) || [], resolution_evidence: ((_b = c.original_evidence) === null || _b === void 0 ? void 0 : _b.filter(function (e) { return e.type === 'RESOLUTION_PROOF'; })) || [], latest_verification_run: ((_c = c.verification_runs) === null || _c === void 0 ? void 0 : _c[0]) || undefined }));
                            }).sort(function (a, b) { return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    console.warn('Supabase fetch fallback to server store:', e_1);
                    return [3 /*break*/, 4];
                case 4:
                    cases = __spreadArray([], SERVER_CASES_STORE, true);
                    if (params === null || params === void 0 ? void 0 : params.status)
                        cases = cases.filter(function (c) { return c.status === params.status; });
                    if (params === null || params === void 0 ? void 0 : params.category)
                        cases = cases.filter(function (c) { return c.category === params.category; });
                    if (params === null || params === void 0 ? void 0 : params.createdBy)
                        cases = cases.filter(function (c) { return c.created_by === params.createdBy; });
                    if (params === null || params === void 0 ? void 0 : params.search) {
                        q_1 = params.search.toLowerCase();
                        cases = cases.filter(function (c) { return c.title.toLowerCase().includes(q_1) || c.description.toLowerCase().includes(q_1) || c.location_text.toLowerCase().includes(q_1); });
                    }
                    return [2 /*return*/, cases.sort(function (a, b) { return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); })];
            }
        });
    });
}
function getCaseById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var supabase, _a, data, error, evidenceList, e_2, found;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    supabase = getSupabaseClient();
                    if (!supabase) return [3 /*break*/, 4];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabase
                            .from('cases')
                            .select("\n          *,\n          evidence:evidence!case_id(*),\n          audit_logs:audit_logs!case_id(*),\n          verification_runs:verification_runs!case_id(\n            *,\n            findings:verification_findings!run_id(*)\n          )\n        ")
                            .eq('id', id)
                            .single()];
                case 2:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (!error && data) {
                        evidenceList = data.evidence || [];
                        return [2 /*return*/, __assign(__assign({}, data), { original_evidence: evidenceList.filter(function (e) { return e.type === 'ORIGINAL_REPORT'; }), resolution_evidence: evidenceList.filter(function (e) { return e.type === 'RESOLUTION_PROOF'; }), latest_verification_run: ((_b = data.verification_runs) === null || _b === void 0 ? void 0 : _b[0]) ? __assign(__assign({}, data.verification_runs[0]), { findings: data.verification_runs[0].findings || [] }) : undefined })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _c.sent();
                    console.warn('Supabase fetch by ID fallback to server store:', e_2);
                    return [3 /*break*/, 4];
                case 4:
                    found = SERVER_CASES_STORE.find(function (c) { return c.id === id; });
                    return [2 /*return*/, found ? JSON.parse(JSON.stringify(found)) : null];
            }
        });
    });
}
function createNewCase(data) {
    return __awaiter(this, void 0, void 0, function () {
        var caseId, evidenceId, auditId, now, originalEvidence, newAuditLog, newCase, supabase, existingProfile, profileErr, caseErr, evidenceErr, auditErr, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    caseId = crypto.randomUUID();
                    evidenceId = crypto.randomUUID();
                    auditId = crypto.randomUUID();
                    now = new Date().toISOString();
                    originalEvidence = {
                        id: evidenceId,
                        case_id: caseId,
                        uploaded_by: data.created_by,
                        type: 'ORIGINAL_REPORT',
                        file_url: data.evidence_url,
                        storage_path: "cases/".concat(caseId, "/original_1.jpg"),
                        mime_type: data.evidence_mime_type,
                        file_size: data.evidence_size,
                        width: data.evidence_width || 1280,
                        height: data.evidence_height || 720,
                        metadata_json: data.evidence_metadata || {
                            timestamp: now,
                            gps: data.latitude && data.longitude ? { latitude: data.latitude, longitude: data.longitude } : undefined,
                        },
                        created_at: now,
                    };
                    newAuditLog = {
                        id: auditId,
                        case_id: caseId,
                        actor_id: data.created_by,
                        action: 'CASE_CREATED',
                        new_state: 'OPEN',
                        details_json: { title: data.title, category: data.category },
                        created_at: now,
                    };
                    newCase = {
                        id: caseId,
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        location_text: data.location_text,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        status: 'OPEN',
                        created_by: data.created_by,
                        created_at: now,
                        updated_at: now,
                        original_evidence: [originalEvidence],
                        resolution_evidence: [],
                        audit_logs: [newAuditLog],
                    };
                    supabase = getSupabaseClient();
                    if (!supabase) return [3 /*break*/, 9];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, supabase.from('profiles').select('id').eq('id', data.created_by).maybeSingle()];
                case 2:
                    existingProfile = (_a.sent()).data;
                    if (!!existingProfile) return [3 /*break*/, 4];
                    return [4 /*yield*/, supabase.from('profiles').upsert({
                            id: data.created_by,
                            role: 'CITIZEN',
                            full_name: 'Elena Rostova (Citizen)',
                            updated_at: now,
                        })];
                case 3:
                    profileErr = (_a.sent()).error;
                    if (profileErr) {
                        console.error('Supabase Profile Upsert Error:', profileErr);
                    }
                    _a.label = 4;
                case 4: return [4 /*yield*/, supabase.from('cases').insert({
                        id: caseId,
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        location_text: data.location_text,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        status: 'OPEN',
                        created_by: data.created_by,
                        created_at: now,
                        updated_at: now,
                    })];
                case 5:
                    caseErr = (_a.sent()).error;
                    if (caseErr) {
                        console.error('Supabase Cases Insert Error:', caseErr);
                        throw new Error("Supabase Case Insert Failed: ".concat(caseErr.message));
                    }
                    return [4 /*yield*/, supabase.from('evidence').insert({
                            id: evidenceId,
                            case_id: caseId,
                            uploaded_by: data.created_by,
                            type: 'ORIGINAL_REPORT',
                            file_url: data.evidence_url,
                            storage_path: "cases/".concat(caseId, "/original_1.jpg"),
                            mime_type: data.evidence_mime_type,
                            file_size: data.evidence_size,
                            width: data.evidence_width || 1280,
                            height: data.evidence_height || 720,
                            metadata_json: originalEvidence.metadata_json,
                            created_at: now,
                        })];
                case 6:
                    evidenceErr = (_a.sent()).error;
                    if (evidenceErr) {
                        console.error('Supabase Evidence Insert Error:', evidenceErr);
                        throw new Error("Supabase Evidence Insert Failed: ".concat(evidenceErr.message));
                    }
                    return [4 /*yield*/, supabase.from('audit_logs').insert({
                            id: auditId,
                            case_id: caseId,
                            actor_id: data.created_by,
                            action: 'CASE_CREATED',
                            new_state: 'OPEN',
                            details_json: newAuditLog.details_json,
                            created_at: now,
                        })];
                case 7:
                    auditErr = (_a.sent()).error;
                    if (auditErr) {
                        console.error('Supabase Audit Log Insert Error:', auditErr);
                        throw new Error("Supabase Audit Log Insert Failed: ".concat(auditErr.message));
                    }
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    console.warn('Supabase DB operation warning (falling back to server global store):', err_1.message || err_1);
                    return [3 /*break*/, 9];
                case 9:
                    // 5. Always persist to server global store for instant availability
                    SERVER_CASES_STORE.unshift(newCase);
                    return [2 /*return*/, newCase];
            }
        });
    });
}
function submitResolutionClaim(data) {
    return __awaiter(this, void 0, void 0, function () {
        var targetCase, now, evidenceId, auditId, resEvidenceItem, runId, initialRun, auditLog, idx, supabase, err_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCaseById(data.case_id)];
                case 1:
                    targetCase = _a.sent();
                    if (!targetCase) {
                        throw new Error('Case not found');
                    }
                    now = new Date().toISOString();
                    evidenceId = crypto.randomUUID();
                    auditId = crypto.randomUUID();
                    resEvidenceItem = {
                        id: evidenceId,
                        case_id: targetCase.id,
                        uploaded_by: data.authority_id,
                        type: 'RESOLUTION_PROOF',
                        file_url: data.resolution_evidence_url,
                        storage_path: "cases/".concat(targetCase.id, "/resolution_").concat(Date.now(), ".jpg"),
                        mime_type: data.resolution_mime_type,
                        file_size: data.resolution_size,
                        width: data.resolution_width || 1280,
                        height: data.resolution_height || 720,
                        metadata_json: data.resolution_metadata || {
                            timestamp: now,
                            gps: targetCase.latitude && targetCase.longitude ? {
                                latitude: targetCase.latitude + 0.00001,
                                longitude: targetCase.longitude + 0.00001,
                            } : undefined,
                        },
                        created_at: now,
                    };
                    if (!targetCase.resolution_evidence) {
                        targetCase.resolution_evidence = [];
                    }
                    targetCase.resolution_evidence.push(resEvidenceItem);
                    runId = crypto.randomUUID();
                    initialRun = {
                        id: runId,
                        case_id: targetCase.id,
                        status: 'PROCESSING',
                        findings: [],
                        created_at: now,
                    };
                    targetCase.status = 'VERIFYING';
                    targetCase.assigned_authority_id = data.authority_id;
                    targetCase.latest_verification_run = initialRun;
                    targetCase.updated_at = now;
                    auditLog = {
                        id: auditId,
                        case_id: targetCase.id,
                        actor_id: data.authority_id,
                        action: 'RESOLUTION_CLAIM_SUBMITTED',
                        previous_state: 'OPEN',
                        new_state: 'VERIFYING',
                        details_json: {
                            notes: data.resolution_notes,
                        },
                        created_at: now,
                    };
                    if (!targetCase.audit_logs) {
                        targetCase.audit_logs = [];
                    }
                    targetCase.audit_logs.push(auditLog);
                    idx = SERVER_CASES_STORE.findIndex(function (c) { return c.id === targetCase.id; });
                    if (idx !== -1) {
                        SERVER_CASES_STORE[idx] = targetCase;
                    }
                    else {
                        SERVER_CASES_STORE.unshift(targetCase);
                    }
                    // Execute Verification Engine Asynchronously (do not await)
                    engine_1.VerificationEngine.executeVerification(targetCase, targetCase.original_evidence || [], targetCase.resolution_evidence).then(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                        var currentCase, prevStatus, completionAudit, supabase, _i, _c, finding, err_3;
                        var run = _b.run, newCaseStatus = _b.newCaseStatus, explanationSummary = _b.explanationSummary, recommendedAction = _b.recommendedAction;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    // Override the ID to match our initial run ID
                                    run.id = runId;
                                    currentCase = SERVER_CASES_STORE.find(function (c) { return c.id === targetCase.id; });
                                    if (!currentCase)
                                        return [2 /*return*/];
                                    prevStatus = currentCase.status;
                                    currentCase.status = newCaseStatus;
                                    currentCase.latest_verification_run = run;
                                    currentCase.updated_at = new Date().toISOString();
                                    completionAudit = {
                                        id: crypto.randomUUID(),
                                        case_id: currentCase.id,
                                        actor_id: 'SYSTEM_VERIFIER',
                                        action: 'VERIFICATION_COMPLETED',
                                        previous_state: prevStatus,
                                        new_state: newCaseStatus,
                                        details_json: {
                                            decision: run.overall_decision,
                                            confidence: run.overall_confidence,
                                            summary: explanationSummary,
                                            nextAction: recommendedAction,
                                        },
                                        created_at: new Date().toISOString(),
                                    };
                                    currentCase.audit_logs.push(completionAudit);
                                    supabase = getSupabaseClient();
                                    if (!supabase) return [3 /*break*/, 10];
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 9, , 10]);
                                    return [4 /*yield*/, supabase.from('cases').update({
                                            status: newCaseStatus,
                                            updated_at: currentCase.updated_at,
                                        }).eq('id', currentCase.id)];
                                case 2:
                                    _d.sent();
                                    return [4 /*yield*/, supabase.from('verification_runs').update({
                                            status: run.status,
                                            overall_decision: run.overall_decision,
                                            overall_confidence: run.overall_confidence,
                                            summary: run.summary,
                                            recommended_next_action: run.recommended_next_action,
                                            completed_at: run.completed_at,
                                        }).eq('id', run.id)];
                                case 3:
                                    _d.sent();
                                    _i = 0, _c = run.findings;
                                    _d.label = 4;
                                case 4:
                                    if (!(_i < _c.length)) return [3 /*break*/, 7];
                                    finding = _c[_i];
                                    return [4 /*yield*/, supabase.from('verification_findings').insert({
                                            id: finding.id,
                                            run_id: run.id,
                                            category: finding.category,
                                            check_name: finding.check_name,
                                            status: finding.status,
                                            confidence: finding.confidence,
                                            explanation: finding.explanation,
                                            metadata_json: finding.metadata_json || {},
                                            created_at: finding.created_at,
                                        })];
                                case 5:
                                    _d.sent();
                                    _d.label = 6;
                                case 6:
                                    _i++;
                                    return [3 /*break*/, 4];
                                case 7: return [4 /*yield*/, supabase.from('audit_logs').insert({
                                        id: completionAudit.id,
                                        case_id: currentCase.id,
                                        actor_id: completionAudit.actor_id,
                                        action: completionAudit.action,
                                        previous_state: completionAudit.previous_state,
                                        new_state: completionAudit.new_state,
                                        details_json: completionAudit.details_json,
                                        created_at: completionAudit.created_at,
                                    })];
                                case 8:
                                    _d.sent();
                                    return [3 /*break*/, 10];
                                case 9:
                                    err_3 = _d.sent();
                                    console.error('Async DB update failed:', err_3);
                                    return [3 /*break*/, 10];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); }).catch(function (err) {
                        console.error('Background verification failed completely:', err);
                        var currentCase = SERVER_CASES_STORE.find(function (c) { return c.id === targetCase.id; });
                        if (currentCase && currentCase.latest_verification_run) {
                            currentCase.latest_verification_run.status = 'FAILED';
                            currentCase.status = 'HUMAN_REVIEW';
                        }
                    });
                    supabase = getSupabaseClient();
                    if (!supabase) return [3 /*break*/, 8];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, supabase.from('cases').update({
                            status: targetCase.status,
                            assigned_authority_id: targetCase.assigned_authority_id,
                            updated_at: now,
                        }).eq('id', targetCase.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, supabase.from('evidence').insert({
                            id: resEvidenceItem.id,
                            case_id: targetCase.id,
                            uploaded_by: data.authority_id,
                            type: 'RESOLUTION_PROOF',
                            file_url: data.resolution_evidence_url,
                            storage_path: resEvidenceItem.storage_path,
                            mime_type: data.resolution_mime_type,
                            file_size: data.resolution_size,
                            width: resEvidenceItem.width,
                            height: resEvidenceItem.height,
                            metadata_json: resEvidenceItem.metadata_json,
                            created_at: now,
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, supabase.from('verification_runs').insert({
                            id: initialRun.id,
                            case_id: targetCase.id,
                            status: initialRun.status,
                            created_at: initialRun.created_at,
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, supabase.from('audit_logs').insert({
                            id: auditId,
                            case_id: targetCase.id,
                            actor_id: data.authority_id,
                            action: auditLog.action,
                            previous_state: auditLog.previous_state,
                            new_state: auditLog.new_state,
                            details_json: auditLog.details_json,
                            created_at: now,
                        })];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    console.warn('Supabase initial submission update warning:', err_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/, { caseItem: targetCase, run: initialRun }];
            }
        });
    });
}
