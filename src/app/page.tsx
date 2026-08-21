import Link from 'next/link';
import { getAllCases } from '@/lib/db/cases';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDateUTC, formatDateTimeUTC } from '@/lib/utils/format';
import {
  Building2,
  ArrowRight,
  FileCheck,
  History,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const revalidate = 0;

export default async function LandingPage() {
  const cases = await getAllCases();
  const queuePreview = cases.slice(0, 5);

  // Metrics
  const openCount = cases.filter(c => c.status === 'OPEN').length;
  const resolvedCount = cases.filter(c => c.status === 'CLAIMED_RESOLVED').length;
  const verifyingCount = cases.filter(c => c.status === 'VERIFYING' || c.status === 'UNDER_REVIEW').length;
  const humanReviewCount = cases.filter(c => c.status === 'HUMAN_REVIEW').length;

  // Extract a flattened list of recent activity from audit logs
  const recentActivity = cases
    .flatMap(c => (c.audit_logs || []).map(log => ({ ...log, caseId: c.id, caseTitle: c.title })))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-slate-100 tracking-tight">
            Verification overview
          </h1>
          <p className="text-[15px] text-slate-400 mt-1">
            Operational summary of all civic issues and verification pipelines.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-[13px] font-medium text-slate-300">Open cases</span>
          </div>
          <span className="text-2xl font-semibold text-slate-100">{openCount}</span>
        </div>
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[13px] font-medium text-slate-300">Claimed resolved</span>
          </div>
          <span className="text-2xl font-semibold text-slate-100">{resolvedCount}</span>
        </div>
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-[13px] font-medium text-slate-300">Awaiting verification</span>
          </div>
          <span className="text-2xl font-semibold text-slate-100">{verifyingCount}</span>
        </div>
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="text-[13px] font-medium text-slate-300">Human review</span>
          </div>
          <span className="text-2xl font-semibold text-slate-100">{humanReviewCount}</span>
        </div>
      </div>

      {/* Verification Queue Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-slate-100">
            Verification queue
          </h2>
          <Link
            href="/authority/cases"
            className="text-[14px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="bg-[#0F1523] border border-slate-800 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] text-slate-300">
              <thead className="bg-[#151D2E] text-slate-400 font-medium border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Case ID</th>
                  <th className="px-4 py-3 font-medium">Issue</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Reported</th>
                  <th className="px-4 py-3 font-medium">Evidence</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {queuePreview.map((item) => {
                  const photosCount = (item.original_evidence?.length || 0) + (item.resolution_evidence?.length || 0);
                  return (
                  <tr key={item.id} className="hover:bg-[#151D2E]/50 transition-colors">
                    <td className="px-4 py-3 text-[13px] text-slate-400 font-semibold tracking-wide">
                      VF-{item.id.slice(0, 4).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-200 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {item.category.charAt(0) + item.category.slice(1).toLowerCase().replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {formatDateUTC(item.created_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-slate-500" />
                        {photosCount} photo{photosCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/cases/${item.id}`}
                        className="inline-flex h-8 px-3 items-center justify-center rounded-md bg-[#1A233A] hover:bg-[#232F4C] text-slate-200 text-[13px] font-medium transition-colors border border-slate-700"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Recent Activity List */}
      <section className="space-y-4">
        <h2 className="text-[20px] font-semibold text-slate-100">
          Recent activity
        </h2>
        
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg shadow-sm">
          <div className="divide-y divide-slate-800/60">
            {recentActivity.map((log) => (
              <div key={log.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#151D2E]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#151D2E] border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-slate-200">
                      {log.action.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[13px] text-slate-500 mt-0.5">
                      Case <Link href={`/cases/${log.caseId}`} className="text-indigo-400 hover:underline">{log.caseId.slice(0, 8)}</Link> - {log.caseTitle}
                    </div>
                  </div>
                </div>
                <div className="text-[13px] text-slate-500 shrink-0 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDateTimeUTC(log.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
