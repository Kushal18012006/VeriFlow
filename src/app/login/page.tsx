'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Building2, Lock, Mail, ArrowRight } from 'lucide-react';
import { UserRole } from '@/lib/domain/types';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [email, setEmail] = useState(role === 'CITIZEN' ? 'citizen@example.org' : 'reviewer@citygov.org');
  const [password, setPassword] = useState('veriflow123');

  const handleRoleToggle = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'CITIZEN') {
      setEmail('citizen@example.org');
    } else {
      setEmail('reviewer@citygov.org');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('veriflow_active_role', role);
    if (role === 'AUTHORITY') {
      router.push('/authority/cases');
    } else {
      router.push('/citizen/cases');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white">Sign In to VeriFlow</h1>
        <p className="text-xs text-slate-400">
          Access your civic case portal or authority verification queue
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        
        {/* Role Toggle */}
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 grid grid-cols-2 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRoleToggle('CITIZEN')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'CITIZEN'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Citizen Portal
          </button>
          <button
            type="button"
            onClick={() => handleRoleToggle('AUTHORITY')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'AUTHORITY'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Authority / Reviewer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <span>Continue as {role === 'CITIZEN' ? 'Citizen' : 'Authority Reviewer'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
