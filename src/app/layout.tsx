import '@/app/globals.css';
import Navbar from '@/components/navigation/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VeriFlow | Real-World Civic Claim Verification Platform',
  description: 'AI-assisted real-world claim verification platform for civic issue resolution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
          <p>© 2026 VeriFlow Verification Platform. Built for National AI Hackathon.</p>
        </footer>
      </body>
    </html>
  );
}
