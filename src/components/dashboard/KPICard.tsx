'use client';

import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui';
import { cn, formatPercentage } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
  invertTrend?: boolean;
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  trend,
  invertTrend = false,
  loading = false,
}: KPICardProps) {
  const isPositive = invertTrend ? trend === 'down' : trend === 'up';
  const TrendIcon = change >= 0 ? TrendingUp : TrendingDown;

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-[var(--border)] rounded mb-3" />
          <div className="h-8 w-32 bg-[var(--border)] rounded mb-2" />
          <div className="h-4 w-28 bg-[var(--border)] rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-mono">
            {value}
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span
              className={cn(
                'flex items-center text-sm font-medium',
                isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'
              )}
            >
              <TrendIcon className="h-4 w-4 mr-0.5" />
              {formatPercentage(Math.abs(change))}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">{changeLabel}</span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--background)]">
          <Icon className="h-6 w-6 text-[var(--primary)]" />
        </div>
      </div>
    </Card>
  );
}
