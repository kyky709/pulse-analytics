'use client';

import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CHART_COLORS } from '@/lib/constants';

interface DataPoint {
  [key: string]: string | number;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  formatValue?: (value: number) => string;
  className?: string;
  xKey?: string;
  yKey?: string;
}

export function BarChart({
  data,
  height = 300,
  color = CHART_COLORS.primary,
  formatValue = formatCurrency,
  className,
  xKey = 'date',
  yKey = 'value',
}: BarChartProps) {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tickFormatter={formatDate}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value) => formatValue(value)}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length && label) {
                return (
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg p-3">
                    <p className="text-sm text-[var(--text-secondary)]">{formatDate(String(label))}</p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                      {formatValue(payload[0].value as number)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
