'use client';

import { Card, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

interface TopProductsProps {
  data: Product[];
  loading?: boolean;
}

export function TopProducts({ data, loading }: TopProductsProps) {
  const maxRevenue = Math.max(...data.map((p) => Number(p.revenue)));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)] py-8">
            No products data
          </p>
        ) : (
          data.map((product) => {
            const percentage = (Number(product.revenue) / maxRevenue) * 100;
            return (
              <div key={product.id}>
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {product.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {product.sales_count} sales
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)] font-mono">
                    {formatCurrency(Number(product.revenue))}
                  </p>
                </div>
                <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
