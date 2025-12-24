'use client';

import { Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, Select, Button, Tabs, TabsList, TabsTrigger, TabsContent, Skeleton } from '@/components/ui';
import { AreaChart, BarChart, LineChart } from '@/components/charts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useFilterStore } from '@/store/filterStore';
import { DATE_RANGES, CHART_COLORS } from '@/lib/constants';
import { formatNumber, exportToCSV } from '@/lib/utils';

export default function AnalyticsPage() {
  const { dateRange, setDateRange } = useFilterStore();
  const days = DATE_RANGES.find((r) => r.value === dateRange)?.days || 7;
  const { revenue, traffic, conversions, loading } = useAnalytics(days);

  const revenueData = revenue.map((r) => ({
    date: r.date,
    value: Number(r.amount),
  }));

  const trafficData = traffic.map((t) => ({
    date: t.date,
    pageViews: t.page_views,
    visitors: t.unique_visitors,
  }));

  const conversionData = conversions.map((c) => ({
    date: c.date,
    signups: c.signups,
    trials: c.trials,
    paid: c.paid_conversions,
  }));

  const handleExport = () => {
    const allData = revenue.map((r, i) => ({
      date: r.date,
      revenue: Number(r.amount),
      pageViews: traffic[i]?.page_views || 0,
      visitors: traffic[i]?.unique_visitors || 0,
      signups: conversions[i]?.signups || 0,
      trials: conversions[i]?.trials || 0,
      paidConversions: conversions[i]?.paid_conversions || 0,
    }));

    exportToCSV(allData, `analytics-${dateRange}`, [
      { key: 'date', label: 'Date' },
      { key: 'revenue', label: 'Revenue' },
      { key: 'pageViews', label: 'Page Views' },
      { key: 'visitors', label: 'Unique Visitors' },
      { key: 'signups', label: 'Signups' },
      { key: 'trials', label: 'Trials' },
      { key: 'paidConversions', label: 'Paid Conversions' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Detailed insights and metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            options={DATE_RANGES.map((r) => ({ value: r.value, label: r.label }))}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="w-40"
          />
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              {loading ? (
                <Skeleton className="h-[300px]" />
              ) : (
                <AreaChart data={revenueData} height={300} />
              )}
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
              </CardHeader>
              {loading ? (
                <Skeleton className="h-[300px]" />
              ) : (
                <LineChart
                  data={trafficData}
                  lines={[
                    { key: 'pageViews', name: 'Page Views', color: CHART_COLORS.primary },
                    { key: 'visitors', name: 'Visitors', color: CHART_COLORS.secondary },
                  ]}
                  height={300}
                  formatValue={formatNumber}
                />
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            {loading ? (
              <Skeleton className="h-[400px]" />
            ) : (
              <AreaChart data={revenueData} height={400} />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Metrics</CardTitle>
            </CardHeader>
            {loading ? (
              <Skeleton className="h-[400px]" />
            ) : (
              <LineChart
                data={trafficData}
                lines={[
                  { key: 'pageViews', name: 'Page Views', color: CHART_COLORS.primary },
                  { key: 'visitors', name: 'Unique Visitors', color: CHART_COLORS.secondary },
                ]}
                height={400}
                formatValue={formatNumber}
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="conversions">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            {loading ? (
              <Skeleton className="h-[400px]" />
            ) : (
              <LineChart
                data={conversionData}
                lines={[
                  { key: 'signups', name: 'Signups', color: CHART_COLORS.primary },
                  { key: 'trials', name: 'Trials', color: CHART_COLORS.secondary },
                  { key: 'paid', name: 'Paid', color: CHART_COLORS.tertiary },
                ]}
                height={400}
                formatValue={formatNumber}
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
