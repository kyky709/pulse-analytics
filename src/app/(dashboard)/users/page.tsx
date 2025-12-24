'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Button, Modal, SearchInput, Select } from '@/components/ui';
import { UsersTable, UserForm, DeleteUserModal } from '@/components/users';
import { useUsers } from '@/hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';
import type { Customer, UserFilters } from '@/types';
import type { CustomerFormData } from '@/lib/validations';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const planOptions = [
  { value: 'all', label: 'All Plans' },
  { value: 'free', label: 'Free' },
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<UserFilters['status']>('all');
  const [plan, setPlan] = useState<UserFilters['plan']>('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editUser, setEditUser] = useState<Customer | null>(null);
  const [deleteUser, setDeleteUser] = useState<Customer | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const { users, loading, pagination, createUser, updateUser, deleteUser: deleteUserFn, deleteUsers } = useUsers({
    search: debouncedSearch,
    status,
    plan,
    page,
    limit: 10,
  });

  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  }, [users, selectedIds.length]);

  const handleCreate = async (data: CustomerFormData) => {
    setFormLoading(true);
    try {
      await createUser(data);
      setShowCreateModal(false);
      toast.success('User created successfully');
    } catch (error) {
      toast.error('Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: CustomerFormData) => {
    if (!editUser) return;
    setFormLoading(true);
    try {
      await updateUser(editUser.id, data);
      setEditUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setFormLoading(true);
    try {
      await deleteUserFn(deleteUser.id);
      setDeleteUser(null);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteUser.id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await deleteUsers(selectedIds);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} users deleted`);
    } catch (error) {
      toast.error('Failed to delete users');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Users</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage your customers and their subscriptions
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              onClear={() => setSearch('')}
            />
          </div>
          <div className="flex gap-2">
            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as UserFilters['status']);
                setPage(1);
              }}
              className="w-32"
            />
            <Select
              options={planOptions}
              value={plan}
              onChange={(e) => {
                setPlan(e.target.value as UserFilters['plan']);
                setPage(1);
              }}
              className="w-32"
            />
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
          <span className="text-sm text-[var(--text-secondary)]">
            {selectedIds.length} selected
          </span>
          <Button variant="danger" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      )}

      {/* Table */}
      <Card padding="none">
        <UsersTable
          users={users}
          loading={loading}
          pagination={pagination}
          selectedIds={selectedIds}
          onPageChange={setPage}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onEdit={setEditUser}
          onDelete={setDeleteUser}
          onView={(user) => setEditUser(user)}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New User"
        description="Create a new customer account"
      >
        <UserForm
          loading={formLoading}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User"
        description="Update customer information"
      >
        <UserForm
          user={editUser}
          loading={formLoading}
          onSubmit={handleUpdate}
          onCancel={() => setEditUser(null)}
        />
      </Modal>

      {/* Delete Modal */}
      <DeleteUserModal
        user={deleteUser}
        loading={formLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteUser(null)}
      />
    </div>
  );
}
