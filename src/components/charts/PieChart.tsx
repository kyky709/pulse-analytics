'use client';

import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { TRAFFIC_SOURCE_COLORS } from '@/lib/constants';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
  [key: string]: string | number | undefined;
}

interface PieChartProps {
  data: DataPoint[];
  height?: number;
  className?: string;
}

const COLORS = Object.values(TRAFFIC_SOURCE_COLORS);

export function PieChart({ data, height = 300, className }: PieChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const percentage = ((data.value / total) * 100).toFixed(1);
                return (
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{data.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {data.value.toLocaleString()} ({percentage}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value, entry) => {
              const data = entry.payload as DataPoint;
              const percentage = ((data.value / total) * 100).toFixed(1);
              return (
                <span className="text-sm text-[var(--text-secondary)]">
                  {value} ({percentage}%)
                </span>
              );
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
