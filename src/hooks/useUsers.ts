'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Customer, UserFilters, PaginationInfo } from '@/types';

export function useUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('customers')
        .select('*', { count: 'exact' });

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.plan && filters.plan !== 'all') {
        query = query.eq('plan', filters.plan);
      }

      query = query.order('created_at', { ascending: false }).range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setUsers(data || []);
      setPagination({
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [supabase, filters?.search, filters?.status, filters?.plan, filters?.page, filters?.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'monthly_spend' | 'lifetime_value' | 'last_activity'>) => {
    const { data, error } = await supabase
      .from('customers')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    await fetchUsers();
    return data;
  };

  const updateUser = async (id: string, userData: Partial<Customer>) => {
    const { data, error } = await supabase
      .from('customers')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await fetchUsers();
    return data;
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchUsers();
  };

  const deleteUsers = async (ids: string[]) => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .in('id', ids);

    if (error) throw error;
    await fetchUsers();
  };

  return {
    users,
    loading,
    error,
    pagination,
    createUser,
    updateUser,
    deleteUser,
    deleteUsers,
    refetch: fetchUsers,
  };
}
