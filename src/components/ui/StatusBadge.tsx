import React from 'react';
import { CaseStatus, VerificationDecision } from '@/lib/domain/types';
import { CheckCircle2, AlertTriangle, Clock, XCircle, FileWarning, Eye } from 'lucide-react';

interface StatusBadgeProps {
  status: CaseStatus | VerificationDecision;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase gap-1.5 rounded-md',
    md: 'px-2.5 py-1 text-xs font-medium tracking-wide uppercase gap-1.5 rounded-md',
    lg: 'px-3 py-1.5 text-sm font-medium tracking-wide uppercase gap-2 rounded-md',
  };

  switch (status) {
    case 'VERIFIED':
      return (
        <span className={`inline-flex items-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified
        </span>
      );
    case 'PARTIALLY_VERIFIED':
      return (
        <span className={`inline-flex items-center bg-amber-500/10 text-amber-500 border border-amber-500/20 ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Partially Verified
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center bg-rose-500/10 text-rose-500 border border-rose-500/20 ${sizeClasses[size]}`}>
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    case 'INSUFFICIENT_EVIDENCE':
      return (
        <span className={`inline-flex items-center bg-amber-500/10 text-amber-500 border border-amber-500/20 ${sizeClasses[size]}`}>
          <FileWarning className="w-3.5 h-3.5" />
          Insufficient Evidence
        </span>
      );
    case 'HUMAN_REVIEW':
      return (
        <span className={`inline-flex items-center bg-purple-500/10 text-purple-400 border border-purple-500/20 ${sizeClasses[size]}`}>
          <Eye className="w-3.5 h-3.5" />
          Human Review
        </span>
      );
    case 'CLAIMED_RESOLVED':
      return (
        <span className={`inline-flex items-center bg-blue-500/10 text-blue-400 border border-blue-500/20 ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5" />
          Claimed Resolved
        </span>
      );
    case 'VERIFYING':
      return (
        <span className={`inline-flex items-center bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5 animate-spin" />
          Verifying...
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className={`inline-flex items-center bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5" />
          Under Review
        </span>
      );
    case 'OPEN':
    default:
      return (
        <span className={`inline-flex items-center bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses[size]}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Open
        </span>
      );
  }
}
