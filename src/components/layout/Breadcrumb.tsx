'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === segments.length - 1;

    return { href, label, isLast };
  });

  return (
    <nav className="hidden sm:flex items-center gap-1 text-sm">
      <Link
        href="/dashboard"
        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map(({ href, label, isLast }) => (
        <span key={href} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-[var(--text-secondary)]" />
          {isLast ? (
            <span className="font-medium text-[var(--text-primary)]">{label}</span>
          ) : (
            <Link
              href={href}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
