'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, User, Building2, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UserRole } from '@/lib/domain/types';
import { DEMO_CITIZEN_USER, DEMO_AUTHORITY_USER } from '@/lib/auth/session';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>('CITIZEN');

  useEffect(() => {
    const saved = localStorage.getItem('veriflow_active_role') as UserRole;
    if (saved) {
      setCurrentRole(saved);
    }
  }, []);

  const toggleRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    localStorage.setItem('veriflow_active_role', newRole);
    if (newRole === 'AUTHORITY') {
      router.push('/authority/cases');
    } else {
      router.push('/citizen/cases');
    }
  };

  const activeUser = currentRole === 'AUTHORITY' ? DEMO_AUTHORITY_USER : DEMO_CITIZEN_USER;

  return (
    <header className="sticky top-0 z-50 bg-[#0B1120] border-b border-slate-800 h-[72px] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-tight text-white leading-none">
              VeriFlow
            </span>
            <span className="text-xs text-slate-400 mt-1 leading-none">
              Civic Operations
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-400 h-[72px]">
          <Link
            href="/"
            className={`h-full flex items-center border-b-[3px] transition-colors ${
              pathname === '/' ? 'text-slate-100 border-indigo-500' : 'border-transparent hover:text-slate-200'
            }`}
          >
            Overview
          </Link>
          <Link
            href="/citizen/cases"
            className={`h-full flex items-center border-b-[3px] transition-colors ${
              pathname.startsWith('/citizen') ? 'text-slate-100 border-indigo-500' : 'border-transparent hover:text-slate-200'
            }`}
          >
            Citizen Portal
          </Link>
          <Link
            href="/authority/cases"
            className={`h-full flex items-center border-b-[3px] transition-colors ${
              pathname.startsWith('/authority') ? 'text-slate-100 border-indigo-500' : 'border-transparent hover:text-slate-200'
            }`}
          >
            Authority Queue
          </Link>
        </nav>

        {/* User / Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[14px] text-slate-200 font-medium leading-tight">{activeUser.full_name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <button
                  onClick={() => toggleRole('CITIZEN')}
                  className={`text-[12px] transition-colors ${currentRole === 'CITIZEN' ? 'text-indigo-400 font-medium' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Citizen
                </button>
                <span className="text-slate-700 text-[10px]">•</span>
                <button
                  onClick={() => toggleRole('AUTHORITY')}
                  className={`text-[12px] transition-colors ${currentRole === 'AUTHORITY' ? 'text-indigo-400 font-medium' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Authority
                </button>
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-[#151D2E] border border-slate-700 flex items-center justify-center text-slate-400">
              <UserCheck className="w-[18px] h-[18px]" />
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden lg:block"></div>

          <Link
            href="/login"
            className="text-[14px] font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
