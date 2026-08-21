import { NextResponse } from 'next/server';
import { getCaseById, SERVER_CASES_STORE, getSupabaseClient } from '@/lib/db/cases';
import { VerificationEngine } from '@/lib/verification/engine';
import { AuditLog } from '@/lib/domain/types';

// Explicitly set maximum duration for this route to prevent Vercel 10s limits if possible (Vercel specific config)
export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

const processingLocks = new Set<string>();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;
    
    // Concurrency Lock: Prevent multiple requests for the same case executing simultaneously
    if (processingLocks.has(caseId)) {
      return NextResponse.json({ success: true, message: 'Verification already in progress (locked)' });
    }
    
    // Acquire lock immediately to prevent async race conditions
    processingLocks.add(caseId);

    const currentCase = await getCaseById(caseId);

    if (!currentCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const currentRun = currentCase.latest_verification_run;

    // Idempotency Check: if it's already verified/completed/failed, return it without re-running
    if (currentCase.status !== 'VERIFYING' && currentCase.status !== 'OPEN') {
      return NextResponse.json({ success: true, message: 'Case is no longer in verifying state', run: currentRun });
    }
    
    if (currentRun && (currentRun.status === 'COMPLETED' || currentRun.status === 'FAILED')) {
      return NextResponse.json({ success: true, message: 'Run already completed', run: currentRun });
    }

    if (!currentRun) {
      return NextResponse.json({ error: 'No verification run found to process' }, { status: 400 });
    }

    const runId = currentRun.id;

    let executeResult;
    try {
      executeResult = await VerificationEngine.executeVerification(
        currentCase,
        currentCase.original_evidence || [],
        currentCase.resolution_evidence || []
      );
    } catch (err: any) {
      console.error('Background verification failed completely:', err);
      // Failsafe state
      const newCaseStatus = 'HUMAN_REVIEW';
      
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('cases').update({ status: newCaseStatus }).eq('id', caseId);
          await supabase.from('verification_runs').update({ status: 'FAILED' }).eq('id', runId);
        } catch (e) {
          console.error('Failsafe DB update error:', e);
        }
      } else {
        const memoryCase = SERVER_CASES_STORE?.find((c: any) => c.id === caseId);
        if (memoryCase && memoryCase.latest_verification_run) {
          memoryCase.latest_verification_run.status = 'FAILED';
          memoryCase.status = newCaseStatus;
        }
      }
      return NextResponse.json({ error: 'Verification failed critically' }, { status: 500 });
    }

    const { run, newCaseStatus, explanationSummary, recommendedAction } = executeResult;
    
    // Override ID to match initial run ID
    run.id = runId;

    const prevStatus = currentCase.status;
    currentCase.status = newCaseStatus;
    currentCase.latest_verification_run = run;
    currentCase.updated_at = new Date().toISOString();

    const completionAudit: AuditLog = {
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

    if (!currentCase.audit_logs) currentCase.audit_logs = [];
    currentCase.audit_logs.push(completionAudit);

    // Update Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('cases').update({
          status: newCaseStatus,
          updated_at: currentCase.updated_at,
        }).eq('id', currentCase.id);

        await supabase.from('verification_runs').update({
          status: run.status,
          overall_decision: run.overall_decision,
          overall_confidence: run.overall_confidence,
          summary: run.summary,
          recommended_next_action: run.recommended_next_action,
          completed_at: run.completed_at,
        }).eq('id', run.id);

        for (const finding of run.findings) {
          await supabase.from('verification_findings').insert({
            id: finding.id,
            run_id: run.id,
            category: finding.category,
            check_name: finding.check_name,
            status: finding.status,
            confidence: finding.confidence,
            explanation: finding.explanation,
            metadata_json: finding.metadata_json || {},
            created_at: finding.created_at,
          });
        }

        await supabase.from('audit_logs').insert({
          id: completionAudit.id,
          case_id: currentCase.id,
          actor_id: completionAudit.actor_id,
          action: completionAudit.action,
          previous_state: completionAudit.previous_state,
          new_state: completionAudit.new_state,
          details_json: completionAudit.details_json,
          created_at: completionAudit.created_at,
        });
      } catch (err) {
        console.error('Async DB update failed:', err);
      }
    } else {
      // Fallback for demo mode
      const memoryCase = SERVER_CASES_STORE?.find((c: any) => c.id === caseId);
      if (memoryCase) {
        memoryCase.status = newCaseStatus;
        memoryCase.latest_verification_run = run;
        memoryCase.updated_at = currentCase.updated_at;
        memoryCase.audit_logs!.push(completionAudit);
      }
    }

    return NextResponse.json({ success: true, run });
  } catch (err: any) {
    console.error('API Verification error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Release concurrency lock
    if (params?.id) {
      processingLocks.delete(params.id);
    }
  }
}
