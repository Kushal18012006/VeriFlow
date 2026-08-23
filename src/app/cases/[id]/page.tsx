import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getCaseById } from '@/lib/db/cases';
import StatusBadge from '@/components/ui/StatusBadge';
import DecisionWhySection from '@/components/cases/DecisionWhySection';
import EvidenceInspector from '@/components/cases/EvidenceInspector';
import AuditTimeline from '@/components/cases/AuditTimeline';
import AuthorityActionPanel from '@/components/cases/AuthorityActionPanel';
import { MapPin, Calendar, ArrowLeft, Building2 } from 'lucide-react';
import { formatDateTimeUTC } from '@/lib/utils/format';
import ClientRefresh from './ClientRefresh';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CaseDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const caseItem = await getCaseById(params.id);
  
  const cookieStore = cookies();
  const currentRole = cookieStore.get('veriflow_role')?.value || 'CITIZEN';

  if (!caseItem) {
    notFound();
  }

  const formattedDate = formatDateTimeUTC(caseItem.created_at);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-6">
        <Link
          href="/authority/cases"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to queue</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                {caseItem.category}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                VF-{caseItem.id.slice(0, 4).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-100 tracking-tight leading-snug max-w-3xl">
              {caseItem.title}
            </h1>
          </div>
          <div className="shrink-0 mt-1">
            <StatusBadge status={caseItem.status} size="lg" />
          </div>
        </div>
      </div>

      {/* Metadata Strip */}
      <div className="bg-[#0F1523] border border-slate-800 p-5 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Case Identifier</span>
          <span className="text-sm font-semibold text-slate-300 block truncate">VF-{caseItem.id.slice(0, 4).toUpperCase()}</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Reported</span>
          <span className="text-sm text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            {formattedDate}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Location</span>
          <span className="text-sm text-slate-300 flex items-center gap-1.5 truncate">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{caseItem.location_text}</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Assigned Authority</span>
          <span className="text-sm text-slate-300 flex items-center gap-1.5 truncate">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{caseItem.assigned_authority_id ? 'Public Works Dept' : 'Unassigned'}</span>
          </span>
        </div>
      </div>

      {/* Issue Overview Panel */}
      <div className="bg-[#0F1523] border border-slate-800 p-5 rounded-lg space-y-2 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-200">
          Issue Description
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          {caseItem.description}
        </p>
      </div>

      {/* Evidence Inspector (Left/Right) */}
      <div className="pt-2">
        <h2 className="text-[18px] font-semibold text-slate-100 mb-4">Evidence</h2>
        <EvidenceInspector
          originalEvidence={caseItem.original_evidence || []}
          resolutionEvidence={caseItem.resolution_evidence || []}
        />
      </div>

      {/* Verification Result */}
      <div className="pt-2">
        <h2 className="text-[18px] font-semibold text-slate-100 mb-4">Decision</h2>
        <DecisionWhySection run={caseItem.latest_verification_run} />
      </div>

      {/* Audit Timeline */}
      <div className="pt-2">
        <h2 className="text-[18px] font-semibold text-slate-100 mb-4">Decision history</h2>
        <AuditTimeline logs={caseItem.audit_logs || []} />
      </div>

      {/* Authority Actions */}
      {currentRole === 'AUTHORITY' && <AuthorityActionPanel caseItem={caseItem} />}

      {caseItem.status === 'VERIFYING' && <ClientRefresh caseId={caseItem.id} />}
    </div>
  );
}
