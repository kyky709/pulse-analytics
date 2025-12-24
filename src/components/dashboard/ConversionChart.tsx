'use client';

import { Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/components/ui';
import { BarChart } from '@/components/charts';
import type { Conversion } from '@/types';

interface ConversionChartProps {
  data: Conversion[];
  loading?: boolean;
}

export function ConversionChart({ data, loading }: ConversionChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.slice(-14).map((c) => ({
    date: c.date,
    signups: c.signups,
    trials: c.trials,
    paid: c.paid_conversions,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversions Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          data={chartData}
          xKey="date"
          yKey="paid"
          height={300}
          color="var(--success)"
        />
      </CardContent>
    </Card>
  );
}
