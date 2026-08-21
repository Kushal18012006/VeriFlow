import Link from 'next/link';
import { getAllCases } from '@/lib/db/cases';
import CaseCard from '@/components/cases/CaseCard';
import { DEMO_CITIZEN_USER } from '@/lib/auth/session';
import { Plus, FolderOpen, CheckCircle2, AlertTriangle } from 'lucide-react';

export const revalidate = 0;

export default async function CitizenDashboard() {
  const allCases = await getAllCases();
  const cases = allCases.filter(c => c.created_by === DEMO_CITIZEN_USER.id);
  
  const activeCount = cases.filter(c => c.status === 'OPEN' || c.status === 'UNDER_REVIEW').length;
  const verifiedCount = cases.filter(c => c.status === 'CLAIMED_RESOLVED').length; // Simplification for demo
  const humanReviewCount = cases.filter(c => c.status === 'HUMAN_REVIEW').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">My reported cases</h1>
          <p className="text-sm text-slate-400 mt-1">Track the resolution status of your civic issue reports.</p>
        </div>
        <Link
          href="/citizen/cases/new"
          className="inline-flex h-10 px-4 items-center justify-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Report new issue</span>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Active issues</p>
            <p className="text-2xl font-semibold text-slate-100">{activeCount}</p>
          </div>
        </div>
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Verified resolved</p>
            <p className="text-2xl font-semibold text-slate-100">{verifiedCount}</p>
          </div>
        </div>
        <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Human review</p>
            <p className="text-2xl font-semibold text-slate-100">{humanReviewCount}</p>
          </div>
        </div>
      </div>

      {/* Case Grid */}
      {cases.length === 0 ? (
        <div className="text-center py-16 bg-[#0F1523] border border-slate-800 rounded-lg">
          <p className="text-slate-400 mb-4 text-sm">You haven't reported any issues yet.</p>
          <Link
            href="/citizen/cases/new"
            className="text-indigo-400 hover:text-indigo-300 font-medium text-sm"
          >
            Report your first issue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} />
          ))}
        </div>
      )}
    </div>
  );
}
