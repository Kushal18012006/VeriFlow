import React from 'react';
import Link from 'next/link';
import { Case } from '@/lib/domain/types';
import StatusBadge from '../ui/StatusBadge';
import SafeImage from '../ui/SafeImage';
import { MapPin, Calendar, ArrowRight, FileCheck } from 'lucide-react';
import { formatDateUTC } from '@/lib/utils/format';

interface CaseCardProps {
  caseItem: Case;
}

export default function CaseCard({ caseItem }: CaseCardProps) {
  const origImage = caseItem.original_evidence?.[0]?.file_url;
  const createdDate = formatDateUTC(caseItem.created_at);

  return (
    <div className="bg-[#0F1523] border border-slate-800 rounded-lg overflow-hidden flex flex-col hover:border-slate-700 transition-colors shadow-sm">
      
      {/* Header: Status and ID */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/60 bg-[#151D2E]/50">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          VF-{caseItem.id.slice(0, 4).toUpperCase()}
        </span>
        <StatusBadge status={caseItem.status} size="sm" />
      </div>

      <div className="flex flex-row">
        {/* Supporting Image (Left) */}
        <div className="w-1/3 bg-slate-900 border-r border-slate-800/60 relative">
          {origImage ? (
            <SafeImage
              src={origImage}
              alt={caseItem.title}
              fallbackTitle={caseItem.title}
              category={caseItem.category}
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-500 absolute inset-0 bg-[#0B1120]">
              <FileCheck className="w-4 h-4 text-slate-600 mb-1" />
            </div>
          )}
        </div>

        {/* Details (Right) */}
        <div className="w-2/3 p-4 flex flex-col gap-3">
          <div>
            <div className="flex flex-wrap gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                {caseItem.category}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 leading-snug">
              {caseItem.title}
            </h3>
          </div>

          <div className="flex flex-col gap-1.5 mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{createdDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{caseItem.location_text}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
              <FileCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{caseItem.resolution_evidence?.length ? '2 Evidence items' : '1 Evidence item'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 pt-0 mt-2">
        <Link
          href={`/cases/${caseItem.id}`}
          className="w-full h-9 rounded-md bg-[#1A233A] hover:bg-[#232F4C] text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <span>View details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
