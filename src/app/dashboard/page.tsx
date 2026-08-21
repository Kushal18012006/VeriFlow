'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardDispatcher() {
  const router = useRouter();

  useEffect(() => {
    const activeRole = localStorage.getItem('veriflow_active_role');
    if (activeRole === 'AUTHORITY') {
      router.replace('/authority/cases');
    } else {
      router.replace('/citizen/cases');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Redirecting to role dashboard...</p>
      </div>
    </div>
  );
}
