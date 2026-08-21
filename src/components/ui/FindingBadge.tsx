import React from 'react';
import { FindingStatus } from '@/lib/domain/types';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface FindingBadgeProps {
  status: FindingStatus;
}

export default function FindingBadge({ status }: FindingBadgeProps) {
  switch (status) {
    case 'PASSED':
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Passed
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
          <XCircle className="w-3.5 h-3.5" />
          Failed
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
          <AlertCircle className="w-3.5 h-3.5" />
          Warning
        </span>
      );
    case 'INCONCLUSIVE':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          Inconclusive
        </span>
      );
  }
}
