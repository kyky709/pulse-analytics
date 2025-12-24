'use client';

import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import type { Customer } from '@/types';

interface DeleteUserModalProps {
  user: Customer | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteUserModal({ user, loading, onConfirm, onCancel }: DeleteUserModalProps) {
  if (!user) return null;

  return (
    <Modal
      isOpen={!!user}
      onClose={onCancel}
      title="Delete User"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-[var(--danger)]" />
        </div>
        <p className="text-[var(--text-primary)]">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{user.full_name}</span>?
        </p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
