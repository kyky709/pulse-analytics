'use client';

import { Card, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { PieChart } from '@/components/charts';
import { TRAFFIC_SOURCE_COLORS } from '@/lib/constants';
import type { Traffic } from '@/types';

interface TrafficChartProps {
  data: Traffic[];
  loading?: boolean;
}

export function TrafficChart({ data, loading }: TrafficChartProps) {
  const sourceData = data.reduce((acc, item) => {
    const source = item.source;
    if (!acc[source]) {
      acc[source] = 0;
    }
    acc[source] += item.unique_visitors;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(sourceData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: TRAFFIC_SOURCE_COLORS[name as keyof typeof TRAFFIC_SOURCE_COLORS],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <PieChart data={chartData} height={300} />
      )}
    </Card>
  );
}
