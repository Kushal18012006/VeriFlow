'use client';

import React, { useState } from 'react';
import { Case } from '@/lib/domain/types';
import { claimCaseServerAction, submitClaimServerAction } from '@/lib/actions/cases';
import { DEMO_AUTHORITY_USER } from '@/lib/auth/session';
import { ShieldCheck, UploadCloud, CheckCircle, FileText, Loader2, Info } from 'lucide-react';

interface AuthorityActionPanelProps {
  caseItem: Case;
}

export default function AuthorityActionPanel({ caseItem }: AuthorityActionPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If the case is assigned to another authority
  if (
    caseItem.assigned_authority_id &&
    caseItem.assigned_authority_id !== DEMO_AUTHORITY_USER.id
  ) {
    return (
      <div className="bg-[#151D2E]/50 border border-slate-800 p-6 rounded-lg mt-8 flex flex-col items-center justify-center text-center">
        <Info className="w-8 h-8 text-slate-500 mb-2" />
        <h3 className="text-sm font-medium text-slate-300">Case Claimed</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          This case is currently assigned to another authority. You cannot submit a resolution.
        </p>
      </div>
    );
  }

  // If the case is unassigned, show Claim button
  if (!caseItem.assigned_authority_id) {
    return (
      <div className="bg-[#0F1523] border border-indigo-500/30 p-6 rounded-lg mt-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <ShieldCheck className="w-24 h-24 text-indigo-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Authority Action Required</h3>
        <p className="text-sm text-slate-400 mb-6 max-w-lg">
          This case requires verification and resolution from the public works department. Claim this case to begin processing.
        </p>

        <form action={claimCaseServerAction}>
          <input type="hidden" name="case_id" value={caseItem.id} />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Claim Case
          </button>
        </form>
      </div>
    );
  }

  // If the case is already verifying/completed, we don't show the submit form
  if (caseItem.status === 'VERIFYING' || caseItem.status === 'CLAIMED_RESOLVED' || caseItem.status === 'VERIFIED') {
    return null;
  }

  // The case is assigned to the current authority and is still UNDER_REVIEW/OPEN
  return (
    <div className="bg-[#0F1523] border border-slate-700 p-6 rounded-lg mt-8 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-indigo-400" />
        Submit Resolution Proof
      </h3>
      
      <form 
        action={submitClaimServerAction}
        onSubmit={() => setIsSubmitting(true)}
        className="space-y-4"
      >
        <input type="hidden" name="case_id" value={caseItem.id} />
        
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Resolution Evidence URL</label>
          <div className="relative">
            <UploadCloud className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="url"
              name="resolution_evidence_url"
              placeholder="https://example.com/repaired-pothole.jpg"
              required
              className="w-full bg-[#151D2E] border border-slate-700 rounded-md py-2 pl-9 pr-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <p className="text-[10px] text-slate-500">Provide a clear photo of the repaired issue.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Resolution Notes (Required)</label>
          <div className="relative">
            <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <textarea
              name="resolution_notes"
              required
              minLength={10}
              placeholder="Describe the repairs made (minimum 10 characters)..."
              rows={3}
              className="w-full bg-[#151D2E] border border-slate-700 rounded-md py-2 pl-9 pr-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting & Verifying...
              </>
            ) : (
              <>
                Submit Resolution
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
