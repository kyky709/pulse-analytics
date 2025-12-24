export const APP_NAME = 'Pulse Analytics';
export const APP_DESCRIPTION = 'Real-time insights for modern businesses';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  USERS: '/users',
  SETTINGS: '/settings',
} as const;

export const DATE_RANGES = [
  { label: 'Last 7 days', value: '7d', days: 7 },
  { label: 'Last 30 days', value: '30d', days: 30 },
  { label: 'Last 90 days', value: '90d', days: 90 },
  { label: 'This year', value: '1y', days: 365 },
] as const;

export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
} as const;

export const PLAN_COLORS = {
  free: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  starter: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  pro: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  enterprise: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
} as const;

export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  tertiary: '#F59E0B',
  quaternary: '#EF4444',
  quinary: '#8B5CF6',
} as const;

export const TRAFFIC_SOURCE_COLORS = {
  organic: '#10B981',
  paid: '#3B82F6',
  social: '#F59E0B',
  direct: '#8B5CF6',
  referral: '#EC4899',
} as const;

export const PAGE_SIZES = [10, 25, 50] as const;
