'use client';

import { DollarSign, Users, TrendingUp, ArrowDownRight } from 'lucide-react';
import { Select } from '@/components/ui';
import { KPICard, RevenueChart, TrafficChart, RecentActivity, TopProducts } from '@/components/dashboard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useFilterStore } from '@/store/filterStore';
import { DATE_RANGES } from '@/lib/constants';

const kpiIcons = [DollarSign, Users, TrendingUp, ArrowDownRight];

export default function DashboardPage() {
  const { dateRange, setDateRange } = useFilterStore();
  const days = DATE_RANGES.find((r) => r.value === dateRange)?.days || 7;
  const { kpis, revenue, traffic, products, activities, loading } = useAnalytics(days);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Welcome back! Here&apos;s what&apos;s happening.
          </p>
        </div>
        <Select
          options={DATE_RANGES.map((r) => ({ value: r.value, label: r.label }))}
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
          className="w-40"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <KPICard
              key={i}
              title=""
              value=""
              change={0}
              icon={kpiIcons[i]}
              trend="up"
              loading
            />
          ))
        ) : (
          kpis.map((kpi, i) => (
            <KPICard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              changeLabel={kpi.changeLabel}
              icon={kpiIcons[i]}
              trend={kpi.trend}
              invertTrend={kpi.invertTrend}
            />
          ))
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenue} loading={loading} />
        <TrafficChart data={traffic} loading={loading} />
      </div>

      {/* Activity & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity data={activities} loading={loading} />
        <TopProducts data={products} loading={loading} />
      </div>
    </div>
  );
}
