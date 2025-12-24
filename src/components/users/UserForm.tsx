'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select } from '@/components/ui';
import { customerSchema, type CustomerFormData } from '@/lib/validations';
import type { Customer } from '@/types';

interface UserFormProps {
  user?: Customer | null;
  loading?: boolean;
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const planOptions = [
  { value: 'free', label: 'Free' },
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
];

export function UserForm({ user, loading, onSubmit, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: user
      ? {
          full_name: user.full_name,
          email: user.email,
          company: user.company ?? '',
          status: user.status,
          plan: user.plan,
        }
      : {
          full_name: '',
          email: '',
          company: '',
          status: 'active' as const,
          plan: 'free' as const,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="John Doe"
        error={errors.full_name?.message}
        {...register('full_name')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Company"
        placeholder="Acme Inc. (optional)"
        error={errors.company?.message}
        {...register('company')}
      />

      <Select
        label="Status"
        options={statusOptions}
        error={errors.status?.message}
        {...register('status')}
      />

      <Select
        label="Plan"
        options={planOptions}
        error={errors.plan?.message}
        {...register('plan')}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
