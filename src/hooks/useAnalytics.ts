'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { subDays, format } from 'date-fns';
import type { KPI, Revenue, Traffic, Conversion, Product, Activity } from '@/types';

interface AnalyticsData {
  kpis: KPI[];
  revenue: Revenue[];
  traffic: Traffic[];
  conversions: Conversion[];
  products: Product[];
  activities: Activity[];
}

export function useAnalytics(days: number = 7) {
  const [data, setData] = useState<AnalyticsData>({
    kpis: [],
    revenue: [],
    traffic: [],
    conversions: [],
    products: [],
    activities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
      const previousStartDate = format(subDays(new Date(), days * 2), 'yyyy-MM-dd');
      const previousEndDate = format(subDays(new Date(), days + 1), 'yyyy-MM-dd');

      const [
        { data: revenue },
        { data: previousRevenue },
        { data: traffic },
        { data: previousTraffic },
        { data: conversions },
        { data: previousConversions },
        { data: products },
        { data: activities },
        { count: totalCustomers },
      ] = await Promise.all([
        supabase.from('revenue').select('*').gte('date', startDate).order('date'),
        supabase.from('revenue').select('*').gte('date', previousStartDate).lte('date', previousEndDate),
        supabase.from('traffic').select('*').gte('date', startDate).order('date'),
        supabase.from('traffic').select('*').gte('date', previousStartDate).lte('date', previousEndDate),
        supabase.from('conversions').select('*').gte('date', startDate).order('date'),
        supabase.from('conversions').select('*').gte('date', previousStartDate).lte('date', previousEndDate),
        supabase.from('products').select('*').order('revenue', { ascending: false }).limit(5),
        supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      ]);

      // Calculate KPIs
      const revenueData = (revenue || []) as Revenue[];
      const prevRevenueData = (previousRevenue || []) as Revenue[];
      const trafficData = (traffic || []) as Traffic[];
      const prevTrafficData = (previousTraffic || []) as Traffic[];
      const conversionsData = (conversions || []) as Conversion[];
      const prevConversionsData = (previousConversions || []) as Conversion[];

      const currentRevenue = revenueData.reduce((sum, r) => sum + Number(r.amount), 0);
      const prevRevenue = prevRevenueData.reduce((sum, r) => sum + Number(r.amount), 0);
      const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

      const currentVisitors = trafficData.reduce((sum, t) => sum + t.unique_visitors, 0);
      const prevVisitors = prevTrafficData.reduce((sum, t) => sum + t.unique_visitors, 0);
      const visitorsChange = prevVisitors > 0 ? ((currentVisitors - prevVisitors) / prevVisitors) * 100 : 0;

      const currentConversions = conversionsData.reduce((sum, c) => sum + c.paid_conversions, 0);
      const prevConversionsTotal = prevConversionsData.reduce((sum, c) => sum + c.paid_conversions, 0);
      const conversionsChange = prevConversionsTotal > 0
        ? ((currentConversions - prevConversionsTotal) / prevConversionsTotal) * 100 : 0;

      const avgBounceRate = trafficData.length > 0
        ? trafficData.reduce((sum, t) => sum + Number(t.bounce_rate), 0) / trafficData.length
        : 0;
      const prevAvgBounceRate = prevTrafficData.length > 0
        ? prevTrafficData.reduce((sum, t) => sum + Number(t.bounce_rate), 0) / prevTrafficData.length
        : 0;
      const bounceRateChange = prevAvgBounceRate > 0
        ? ((avgBounceRate - prevAvgBounceRate) / prevAvgBounceRate) * 100 : 0;

      const kpis: KPI[] = [
        {
          title: 'Total Revenue',
          value: `$${currentRevenue.toLocaleString()}`,
          change: revenueChange,
          changeLabel: `vs last ${days} days`,
          trend: revenueChange >= 0 ? 'up' : 'down',
        },
        {
          title: 'Active Users',
          value: totalCustomers?.toLocaleString() || '0',
          change: visitorsChange,
          changeLabel: `vs last ${days} days`,
          trend: visitorsChange >= 0 ? 'up' : 'down',
        },
        {
          title: 'Conversions',
          value: currentConversions.toLocaleString(),
          change: conversionsChange,
          changeLabel: `vs last ${days} days`,
          trend: conversionsChange >= 0 ? 'up' : 'down',
        },
        {
          title: 'Bounce Rate',
          value: `${avgBounceRate.toFixed(1)}%`,
          change: bounceRateChange,
          changeLabel: `vs last ${days} days`,
          trend: bounceRateChange <= 0 ? 'up' : 'down',
          invertTrend: true,
        },
      ];

      setData({
        kpis,
        revenue: revenueData,
        traffic: trafficData,
        conversions: conversionsData,
        products: (products || []) as Product[],
        activities: (activities || []) as Activity[],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [supabase, days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
