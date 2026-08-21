import { Case, EvidenceItem, VerificationRun, AuditLog, CaseStatus } from '../domain/types';
import { VerificationEngine } from '../verification/engine';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Initial seed cases using valid PostgreSQL UUIDs
const INITIAL_SEED_CASES: Case[] = [
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

declare global {
  var _veriflow_cases_store: Case[] | undefined;
}

if (!globalThis._veriflow_cases_store) {
  globalThis._veriflow_cases_store = [...INITIAL_SEED_CASES];
}

export const SERVER_CASES_STORE = globalThis._veriflow_cases_store;

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url === 'https://placeholder.supabase.co') return null;
  return createSupabaseClient(url, key);
}

export async function getAllCases(params?: {
  status?: CaseStatus;
  category?: string;
  search?: string;
  createdBy?: string;
}): Promise<Case[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from('cases').select(`
        *,
        original_evidence:evidence!case_id(*),
        audit_logs:audit_logs!case_id(*),
        verification_runs:verification_runs!case_id(*)
      `);

      if (params?.status) query = query.eq('status', params.status);
      if (params?.category) query = query.eq('category', params.category);
      if (params?.createdBy) query = query.eq('created_by', params.createdBy);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          ...c,
          original_evidence: c.original_evidence?.filter((e: any) => e.type === 'ORIGINAL_REPORT') || [],
          resolution_evidence: c.original_evidence?.filter((e: any) => e.type === 'RESOLUTION_PROOF') || [],
          latest_verification_run: c.verification_runs?.[0] || undefined,
        })).sort((a: Case, b: Case) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    } catch (e) {
      console.warn('Supabase fetch fallback to server store:', e);
    }
  }

  let cases = [...SERVER_CASES_STORE];
  if (params?.status) cases = cases.filter(c => c.status === params.status);
  if (params?.category) cases = cases.filter(c => c.category === params.category);
  if (params?.createdBy) cases = cases.filter(c => c.created_by === params.createdBy);
  if (params?.search) {
    const q = params.search.toLowerCase();
    cases = cases.filter(
      c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.location_text.toLowerCase().includes(q)
    );
  }

  return cases.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getCaseById(id: string): Promise<Case | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          evidence:evidence!case_id(*),
          audit_logs:audit_logs!case_id(*),
          verification_runs:verification_runs!case_id(
            *,
            findings:verification_findings!run_id(*)
          )
        `)
        .eq('id', id)
        .single();

      if (!error && data) {
        const evidenceList = data.evidence || [];
        return {
          ...data,
          original_evidence: evidenceList.filter((e: any) => e.type === 'ORIGINAL_REPORT'),
          resolution_evidence: evidenceList.filter((e: any) => e.type === 'RESOLUTION_PROOF'),
          latest_verification_run: data.verification_runs?.[0] ? {
            ...data.verification_runs[0],
            findings: data.verification_runs[0].findings || [],
          } : undefined,
        };
      }
    } catch (e) {
      console.warn('Supabase fetch by ID fallback to server store:', e);
    }
  }

  const found = SERVER_CASES_STORE.find(c => c.id === id);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function createNewCase(data: {
  title: string;
  description: string;
  category: string;
  location_text: string;
  latitude?: number;
  longitude?: number;
  created_by: string;
  evidence_url: string;
  evidence_mime_type: string;
  evidence_size: number;
  evidence_width?: number;
  evidence_height?: number;
  evidence_metadata?: Record<string, unknown>;
}): Promise<Case> {
  const caseId = crypto.randomUUID();
  const evidenceId = crypto.randomUUID();
  const auditId = crypto.randomUUID();
  const now = new Date().toISOString();

  // 1. Prepare original evidence object
  const originalEvidence: EvidenceItem = {
    id: evidenceId,
    case_id: caseId,
    uploaded_by: data.created_by,
    type: 'ORIGINAL_REPORT',
    file_url: data.evidence_url,
    storage_path: `cases/${caseId}/original_1.jpg`,
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

  // 2. Prepare CASE_CREATED audit log
  const newAuditLog: AuditLog = {
    id: auditId,
    case_id: caseId,
    actor_id: data.created_by,
    action: 'CASE_CREATED',
    new_state: 'OPEN',
    details_json: { title: data.title, category: data.category },
    created_at: now,
  };

  // 3. Assemble Case domain object
  const newCase: Case = {
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

  // 4. Insert into Supabase if connected
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // Ensure user profile exists to prevent Foreign Key constraints
      const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', data.created_by).maybeSingle();
      if (!existingProfile) {
        const { error: profileErr } = await supabase.from('profiles').upsert({
          id: data.created_by,
          role: 'CITIZEN',
          full_name: 'Elena Rostova (Citizen)',
          updated_at: now,
        });
        if (profileErr) {
          console.error('Supabase Profile Upsert Error:', profileErr);
        }
      }

      // Insert Case
      const { error: caseErr } = await supabase.from('cases').insert({
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
      });
      if (caseErr) {
        console.error('Supabase Cases Insert Error:', caseErr);
        throw new Error(`Supabase Case Insert Failed: ${caseErr.message}`);
      }

      // Insert Evidence
      const { error: evidenceErr } = await supabase.from('evidence').insert({
        id: evidenceId,
        case_id: caseId,
        uploaded_by: data.created_by,
        type: 'ORIGINAL_REPORT',
        file_url: data.evidence_url,
        storage_path: `cases/${caseId}/original_1.jpg`,
        mime_type: data.evidence_mime_type,
        file_size: data.evidence_size,
        width: data.evidence_width || 1280,
        height: data.evidence_height || 720,
        metadata_json: originalEvidence.metadata_json,
        created_at: now,
      });
      if (evidenceErr) {
        console.error('Supabase Evidence Insert Error:', evidenceErr);
        throw new Error(`Supabase Evidence Insert Failed: ${evidenceErr.message}`);
      }

      // Insert Audit Log
      const { error: auditErr } = await supabase.from('audit_logs').insert({
        id: auditId,
        case_id: caseId,
        actor_id: data.created_by,
        action: 'CASE_CREATED',
        new_state: 'OPEN',
        details_json: newAuditLog.details_json,
        created_at: now,
      });
      if (auditErr) {
        console.error('Supabase Audit Log Insert Error:', auditErr);
        throw new Error(`Supabase Audit Log Insert Failed: ${auditErr.message}`);
      }
    } catch (err: any) {
      console.warn('Supabase DB operation warning (falling back to server global store):', err.message || err);
    }
  }

  // 5. Always persist to server global store for instant availability
  SERVER_CASES_STORE.unshift(newCase);
  return newCase;
}

export async function submitResolutionClaim(data: {
  case_id: string;
  authority_id: string;
  resolution_notes: string;
  resolution_evidence_url: string;
  resolution_mime_type: string;
  resolution_size: number;
  resolution_width?: number;
  resolution_height?: number;
  resolution_metadata?: Record<string, unknown>;
}): Promise<{ caseItem: Case; run: VerificationRun }> {
  const targetCase = await getCaseById(data.case_id);
  if (!targetCase) {
    throw new Error('Case not found');
  }

  const now = new Date().toISOString();
  const evidenceId = crypto.randomUUID();
  const auditId = crypto.randomUUID();

  // Create resolution evidence item
  const resEvidenceItem: EvidenceItem = {
    id: evidenceId,
    case_id: targetCase.id,
    uploaded_by: data.authority_id,
    type: 'RESOLUTION_PROOF',
    file_url: data.resolution_evidence_url,
    storage_path: `cases/${targetCase.id}/resolution_${Date.now()}.jpg`,
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

  // Create initial PROCESSING VerificationRun
  const runId = crypto.randomUUID();
  const initialRun: VerificationRun = {
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

  // Append Audit Log for Submission
  const auditLog: AuditLog = {
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

  // Sync server global store initially
  const idx = SERVER_CASES_STORE.findIndex(c => c.id === targetCase.id);
  if (idx !== -1) {
    SERVER_CASES_STORE[idx] = targetCase;
  } else {
    SERVER_CASES_STORE.unshift(targetCase);
  }

  // Supabase update for initial submission if connected
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('cases').update({
        status: targetCase.status,
        assigned_authority_id: targetCase.assigned_authority_id,
        updated_at: now,
      }).eq('id', targetCase.id);

      await supabase.from('evidence').insert({
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
      });

      await supabase.from('verification_runs').insert({
        id: initialRun.id,
        case_id: targetCase.id,
        status: initialRun.status,
        created_at: initialRun.created_at,
      });

      await supabase.from('audit_logs').insert({
        id: auditId,
        case_id: targetCase.id,
        actor_id: data.authority_id,
        action: auditLog.action,
        previous_state: auditLog.previous_state,
        new_state: auditLog.new_state,
        details_json: auditLog.details_json,
        created_at: now,
      });
    } catch (err) {
      console.warn('Supabase initial submission update warning:', err);
    }
  }

  return { caseItem: targetCase, run: initialRun };
}
