import { Activity } from 'lucide-react';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-lg p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--primary)] text-white mb-4">
              <Activity className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{APP_NAME}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{APP_DESCRIPTION}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
