import React from 'react';
import { VerificationRun } from '@/lib/domain/types';
import StatusBadge from '../ui/StatusBadge';
import FindingBadge from '../ui/FindingBadge';
import { ShieldCheck, Info, FileText } from 'lucide-react';

interface DecisionWhySectionProps {
  run?: VerificationRun;
}

export default function DecisionWhySection({ run }: DecisionWhySectionProps) {
  if (!run) {
    return (
      <div className="bg-[#0F1523] border border-slate-800 p-8 rounded-lg shadow-sm text-center text-slate-400">
        <Info className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">Verification Pending</h3>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          No verification run executed yet. Triggers automatically when authority resolution proof is submitted.
        </p>
      </div>
    );
  }

  if (run.status === 'PROCESSING') {
    return (
      <div className="bg-[#0F1523] border border-slate-800 p-8 rounded-lg shadow-sm text-center text-slate-400 animate-pulse">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <h3 className="text-base font-semibold text-indigo-400 uppercase tracking-widest">Verifying</h3>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          Analyzing evidence and running deterministic models...
        </p>
      </div>
    );
  }

  const confidencePercentage = run.overall_confidence ? Math.round(run.overall_confidence * 100) : 0;

  return (
    <div className="bg-[#0F1523] border border-slate-800 rounded-lg overflow-hidden shadow-sm">
      {/* Header Banner */}
      <div className="bg-[#151D2E] px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Verification Result
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic check findings & evidence-support assessment
            </p>
          </div>
        </div>
        <div>
          <StatusBadge status={run.overall_decision || 'HUMAN_REVIEW'} size="lg" />
        </div>
      </div>

      {/* Decision Summary Grid */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Decision Box */}
          <div className="bg-[#0B101E] p-4 rounded-lg border border-slate-800 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block mb-2">
              Final Decision
            </span>
            <div className="text-lg font-semibold text-slate-200">
              {run.overall_decision?.replace(/_/g, ' ') || 'HUMAN REVIEW'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Recorded in immutable audit trail
            </p>
          </div>

          {/* Evidence Support Score */}
          <div className="bg-[#0B101E] p-4 rounded-lg border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Evidence Support
              </span>
              <span className="text-sm font-semibold text-indigo-400">
                {confidencePercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              *Structural support rating, not probability.
            </p>
          </div>

          {/* Recommended Next Action */}
          <div className="bg-[#0B101E] p-4 rounded-lg border border-slate-800 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block mb-2">
              Recommended Action
            </span>
            <p className="text-sm font-medium text-slate-200 leading-snug">
              {run.recommended_next_action || 'Proceed with standard operational review.'}
            </p>
          </div>
        </div>

        {/* Human Readable Explanation Summary */}
        <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-lg text-sm text-slate-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <span className="font-semibold text-indigo-300 block mb-1">
              Execution Summary
            </span>
            <p className="text-slate-300 leading-relaxed text-sm">{run.summary}</p>
          </div>
        </div>

        {/* Individual Checks Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Individual Findings ({run.findings.length})
          </h3>

          <div className="space-y-2">
            {run.findings.map((finding) => (
              <div
                key={finding.id}
                className="bg-[#0B101E] border border-slate-800 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700">
                      {finding.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-semibold text-slate-200">
                      {finding.check_name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {finding.explanation}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-medium text-slate-400">
                    Support: {Math.round(finding.confidence * 100)}%
                  </span>
                  <FindingBadge status={finding.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
