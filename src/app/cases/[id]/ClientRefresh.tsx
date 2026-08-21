'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRefresh({ caseId }: { caseId: string }) {
  const router = useRouter();
  const triggered = useRef(false);

  useEffect(() => {
    // 1. Kick off the actual verification execution on mount
    if (!triggered.current) {
      triggered.current = true;
      fetch(`/api/cases/${caseId}/verify`, { method: 'POST' }).catch(console.error);
    }

    // 2. Poll the server for state changes so the UI updates when done
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);

    return () => clearInterval(interval);
  }, [router, caseId]);

  return null;
}
