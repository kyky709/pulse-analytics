export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user' | 'viewer';
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  company: string | null;
  status: 'active' | 'inactive' | 'pending';
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  monthly_spend: number;
  lifetime_value: number;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
}

export interface Revenue {
  id: string;
  date: string;
  amount: number;
  type: 'subscription' | 'one_time' | 'addon';
  customer_id: string | null;
  created_at: string;
}

export interface Traffic {
  id: string;
  date: string;
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  source: 'organic' | 'paid' | 'social' | 'direct' | 'referral';
  created_at: string;
}

export interface Conversion {
  id: string;
  date: string;
  signups: number;
  trials: number;
  paid_conversions: number;
  churn: number;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string | null;
  customer_id: string | null;
  action: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string | null;
  price: number;
  sales_count: number;
  revenue: number;
  created_at: string;
}

export interface KPI {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  trend: 'up' | 'down';
  invertTrend?: boolean;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface UserFilters {
  search?: string;
  status?: Customer['status'] | 'all';
  plan?: Customer['plan'] | 'all';
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
