'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Building, Calendar, CreditCard, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Avatar, Skeleton } from '@/components/ui';
import { UserForm, DeleteUserModal } from '@/components/users';
import { createClient } from '@/lib/supabase/client';
import type { Customer } from '@/types';
import type { CustomerFormData } from '@/lib/validations';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        toast.error('User not found');
        router.push('/users');
        return;
      }

      setUser(data as Customer);
      setLoading(false);
    };

    fetchUser();
  }, [params.id, supabase, router]);

  const handleUpdate = async (data: CustomerFormData) => {
    const { error } = await supabase
      .from('customers')
      .update(data)
      .eq('id', params.id);

    if (error) {
      toast.error('Failed to update user');
      return;
    }

    setUser((prev) => prev ? { ...prev, ...data } : null);
    setIsEditOpen(false);
    toast.success('User updated successfully');
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', params.id);

    if (error) {
      toast.error('Failed to delete user');
      return;
    }

    toast.success('User deleted successfully');
    router.push('/users');
  };

  const statusColors = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning',
  } as const;

  const planColors = {
    free: 'default',
    starter: 'info',
    pro: 'success',
    enterprise: 'warning',
  } as const;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={user.full_name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{user.full_name}</h1>
            <p className="text-[var(--text-secondary)]">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            Edit User
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[var(--text-secondary)]" />
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Email</p>
                <p className="text-[var(--text-primary)]">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-[var(--text-secondary)]" />
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Company</p>
                <p className="text-[var(--text-primary)]">{user.company || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[var(--text-secondary)]" />
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Joined</p>
                <p className="text-[var(--text-primary)]">
                  {format(new Date(user.created_at), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-[var(--text-secondary)]" />
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Last Activity</p>
                <p className="text-[var(--text-primary)]">
                  {user.last_activity
                    ? format(new Date(user.last_activity), 'MMM d, yyyy h:mm a')
                    : 'Never'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription & Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Status</span>
              <Badge variant={statusColors[user.status]}>{user.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Plan</span>
              <Badge variant={planColors[user.plan]}>{user.plan}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Monthly Spend</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">
                ${user.monthly_spend?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Lifetime Value</span>
              <span className="font-mono font-medium text-[var(--text-primary)]">
                ${user.lifetime_value?.toFixed(2) || '0.00'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditOpen && (
        <UserForm
          user={user}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditOpen(false)}
        />
      )}

      <DeleteUserModal
        user={isDeleteOpen ? user : null}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
