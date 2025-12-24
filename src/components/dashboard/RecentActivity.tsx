'use client';

import { Card, CardHeader, CardTitle, Avatar, Skeleton } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import type { Activity } from '@/types';

interface RecentActivityProps {
  data: Activity[];
  loading?: boolean;
}

const actionIcons: Record<string, string> = {
  signup: 'signed up',
  upgrade: 'upgraded to Pro',
  purchase: 'made a purchase',
  invite: 'invited a team member',
  update: 'updated their profile',
};

export function RecentActivity({ data, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <div className="space-y-4 max-h-[350px] overflow-y-auto">
        {data.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)] py-8">
            No recent activity
          </p>
        ) : (
          data.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar name={activity.description || 'User'} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)]">
                  <span className="font-medium">{activity.description || 'User'}</span>{' '}
                  {actionIcons[activity.action] || activity.action}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {formatRelativeTime(activity.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
