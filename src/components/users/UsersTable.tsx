'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  Badge,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  Skeleton,
  Pagination,
} from '@/components/ui';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { STATUS_COLORS, PLAN_COLORS } from '@/lib/constants';
import type { Customer, PaginationInfo } from '@/types';

interface UsersTableProps {
  users: Customer[];
  loading: boolean;
  pagination: PaginationInfo;
  selectedIds: string[];
  onPageChange: (page: number) => void;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEdit: (user: Customer) => void;
  onDelete: (user: Customer) => void;
  onView: (user: Customer) => void;
}

export function UsersTable({
  users,
  loading,
  pagination,
  selectedIds,
  onPageChange,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onView,
}: UsersTableProps) {
  const allSelected = users.length > 0 && users.every((u) => selectedIds.includes(u.id));

  if (loading) {
    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Spend</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-5" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Spend</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p className="text-[var(--text-secondary)]">No users found</p>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => onSelect(user.id)}
                    className="h-4 w-4 rounded border-[var(--border)]"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={user.full_name} size="sm" />
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {user.full_name}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_COLORS[user.status]}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={PLAN_COLORS[user.plan]}>
                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {formatCurrency(Number(user.monthly_spend))}/mo
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu
                    trigger={
                      <button className="p-2 rounded-md hover:bg-[var(--background)] transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-[var(--text-secondary)]" />
                      </button>
                    }
                  >
                    <DropdownItem onClick={() => onView(user)}>
                      <Eye className="h-4 w-4" />
                      View
                    </DropdownItem>
                    <DropdownItem onClick={() => onEdit(user)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem variant="danger" onClick={() => onDelete(user)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)]">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
            users
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
