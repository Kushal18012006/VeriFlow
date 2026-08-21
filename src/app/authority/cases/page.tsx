import Link from 'next/link';
import { getAllCases } from '@/lib/db/cases';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDateUTC } from '@/lib/utils/format';
import { Search, Filter, Layers, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function AuthorityCasesPage() {
  const cases = await getAllCases();

  // Metrics
  const totalCount = cases.length;
  const openCount = cases.filter(c => c.status === 'OPEN').length;
  const reviewCount = cases.filter(c => c.status === 'HUMAN_REVIEW' || c.status === 'UNDER_REVIEW').length;
  const resolvedCount = cases.filter(c => c.status === 'CLAIMED_RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Authority verification queue</h1>
        <p className="text-sm text-slate-400 mt-1">Manage, verify, and resolve civic operations tickets.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Operations</span>
          </div>
          <span className="text-2xl font-semibold text-slate-100">{totalCount}</span>
        </div>
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Open Issues</span>
          </div>
          <span className="text-2xl font-semibold text-slate-100">{openCount}</span>
        </div>
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Claimed Resolved</span>
          </div>
          <span className="text-2xl font-semibold text-slate-100">{resolvedCount}</span>
        </div>
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Under Review</span>
          </div>
          <span className="text-2xl font-semibold text-slate-100">{reviewCount}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by Case ID, Title, or Location..." 
            className="w-full h-10 pl-9 pr-4 bg-[#0F1523] border border-slate-800 rounded-md text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-4 bg-[#0F1523] border border-slate-800 rounded-md text-sm font-medium text-slate-300 hover:text-slate-100 flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" />
            Category
          </button>
          <button className="h-10 px-4 bg-[#0F1523] border border-slate-800 rounded-md text-sm font-medium text-slate-300 hover:text-slate-100 flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" />
            Status
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#0F1523] border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#151D2E] text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-medium">Case ID</th>
                <th className="px-4 py-3 font-medium">Issue & Location</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Evidence</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cases.map((item) => {
                const photosCount = (item.original_evidence?.length || 0) + (item.resolution_evidence?.length || 0);
                return (
                  <tr key={item.id} className="hover:bg-[#151D2E]/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400 font-semibold tracking-wide">
                      VF-{item.id.slice(0, 4).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200 max-w-[250px] truncate">{item.title}</div>
                      <div className="text-xs text-slate-500 max-w-[250px] truncate mt-0.5">{item.location_text}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {photosCount} photo{photosCount !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/cases/${item.id}`}
                        className="inline-flex h-8 px-3 items-center justify-center rounded-md bg-[#1A233A] hover:bg-[#232F4C] text-slate-200 text-xs font-medium transition-colors border border-slate-700"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
