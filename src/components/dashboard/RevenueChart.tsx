'use client';

import { Card, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { AreaChart } from '@/components/charts';
import type { Revenue } from '@/types';

interface RevenueChartProps {
  data: Revenue[];
  loading?: boolean;
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  const chartData = data.map((item) => ({
    date: item.date,
    value: Number(item.amount),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <AreaChart data={chartData} height={300} />
      )}
    </Card>
  );
}
