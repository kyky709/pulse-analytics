'use client';

import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatDate } from '@/lib/utils';
import { CHART_COLORS } from '@/lib/constants';

interface DataPoint {
  date: string;
  [key: string]: string | number;
}

interface LineConfig {
  key: string;
  name: string;
  color: string;
}

interface LineChartProps {
  data: DataPoint[];
  lines: LineConfig[];
  height?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export function LineChart({
  data,
  lines,
  height = 300,
  formatValue = (v) => v.toLocaleString(),
  className,
}: LineChartProps) {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatValue}
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
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{formatDate(String(label))}</p>
                    {payload.map((entry, index) => (
                      <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {formatValue(entry.value as number)}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <span className="text-sm text-[var(--text-secondary)]">{value}</span>
            )}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: line.color }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
