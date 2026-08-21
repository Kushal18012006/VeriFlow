import React from 'react';
import { AuditLog } from '@/lib/domain/types';
import { History, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDateTimeUTC } from '@/lib/utils/format';

interface AuditTimelineProps {
  logs: AuditLog[];
}

export default function AuditTimeline({ logs }: AuditTimelineProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-[#0F1523] border border-slate-800 p-6 rounded-lg text-slate-500 text-sm">
        No audit logs available for this case.
      </div>
    );
  }

  // Sort logs by created_at descending (newest first)
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="bg-[#0F1523] border border-slate-800 rounded-lg p-6 shadow-sm">
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
        {sortedLogs.map((log, index) => (
          <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Timeline Node icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-[#151D2E] text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {log.action.includes('VERIFICATION') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : log.action.includes('CREATED') ? (
                <History className="w-4 h-4 text-indigo-400" />
              ) : (
                <User className="w-4 h-4 text-slate-400" />
              )}
            </div>
            
            {/* Log Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#0B101E] p-4 rounded-lg border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {log.action.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-slate-500">
                  {formatDateTimeUTC(log.created_at)}
                </span>
              </div>
              
              {(log.previous_state || log.new_state) && (
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  {log.previous_state && (
                    <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">
                      {log.previous_state}
                    </span>
                  )}
                  {log.previous_state && <span>→</span>}
                  <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200">
                    {log.new_state}
                  </span>
                </div>
              )}
              
              {log.details_json && Object.keys(log.details_json).length > 0 && (
                <div className="mt-2 text-xs text-slate-400 bg-[#0F1523] p-2.5 rounded-md border border-slate-800 font-mono">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(log.details_json, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
