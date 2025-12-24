-- Pulse Analytics Seed Data
-- Run this script after the schema.sql to populate test data

-- Clear existing data
TRUNCATE public.customers CASCADE;
TRUNCATE public.revenue CASCADE;
TRUNCATE public.traffic CASCADE;
TRUNCATE public.conversions CASCADE;
TRUNCATE public.activities CASCADE;
TRUNCATE public.products CASCADE;

-- Seed des customers (30 clients fictifs)
INSERT INTO public.customers (email, full_name, company, status, plan, monthly_spend, lifetime_value, last_activity)
SELECT
  'user' || i || '@example.com',
  CASE (i % 10)
    WHEN 0 THEN 'Alice Johnson'
    WHEN 1 THEN 'Bob Smith'
    WHEN 2 THEN 'Charlie Brown'
    WHEN 3 THEN 'Diana Ross'
    WHEN 4 THEN 'Edward Norton'
    WHEN 5 THEN 'Fiona Apple'
    WHEN 6 THEN 'George Lucas'
    WHEN 7 THEN 'Hannah Montana'
    WHEN 8 THEN 'Ivan Petrov'
    ELSE 'Julia Roberts'
  END || ' ' || i,
  CASE (i % 5)
    WHEN 0 THEN 'TechCorp'
    WHEN 1 THEN 'StartupXYZ'
    WHEN 2 THEN 'BigCompany Inc'
    WHEN 3 THEN 'SmallBiz LLC'
    ELSE 'Freelancer'
  END,
  CASE (i % 4)
    WHEN 0 THEN 'active'
    WHEN 1 THEN 'active'
    WHEN 2 THEN 'active'
    ELSE 'inactive'
  END,
  CASE (i % 4)
    WHEN 0 THEN 'free'
    WHEN 1 THEN 'starter'
    WHEN 2 THEN 'pro'
    ELSE 'enterprise'
  END,
  (random() * 500 + 10)::DECIMAL(10,2),
  (random() * 5000 + 100)::DECIMAL(10,2),
  NOW() - (random() * INTERVAL '30 days')
FROM generate_series(1, 30) AS i;

-- Seed des revenus (90 jours)
INSERT INTO public.revenue (date, amount, type)
SELECT
  CURRENT_DATE - (i || ' days')::INTERVAL,
  (random() * 5000 + 500)::DECIMAL(10,2),
  CASE (i % 3)
    WHEN 0 THEN 'subscription'
    WHEN 1 THEN 'one_time'
    ELSE 'addon'
  END
FROM generate_series(0, 89) AS i;

-- Seed du trafic (90 jours)
INSERT INTO public.traffic (date, page_views, unique_visitors, bounce_rate, avg_session_duration, source)
SELECT
  CURRENT_DATE - (i || ' days')::INTERVAL,
  (random() * 10000 + 1000)::INTEGER,
  (random() * 3000 + 300)::INTEGER,
  (random() * 40 + 20)::DECIMAL(5,2),
  (random() * 300 + 60)::INTEGER,
  CASE (i % 5)
    WHEN 0 THEN 'organic'
    WHEN 1 THEN 'paid'
    WHEN 2 THEN 'social'
    WHEN 3 THEN 'direct'
    ELSE 'referral'
  END
FROM generate_series(0, 89) AS i;

-- Seed des conversions (90 jours)
INSERT INTO public.conversions (date, signups, trials, paid_conversions, churn)
SELECT
  CURRENT_DATE - (i || ' days')::INTERVAL,
  (random() * 50 + 5)::INTEGER,
  (random() * 30 + 2)::INTEGER,
  (random() * 15 + 1)::INTEGER,
  (random() * 5)::INTEGER
FROM generate_series(0, 89) AS i;

-- Seed des produits
INSERT INTO public.products (name, category, price, sales_count, revenue)
VALUES
  ('Pro Plan Monthly', 'Subscription', 29.99, 1250, 37487.50),
  ('Enterprise Annual', 'Subscription', 999.00, 45, 44955.00),
  ('API Access Addon', 'Addon', 49.99, 320, 15996.80),
  ('Priority Support', 'Addon', 19.99, 580, 11594.20),
  ('Custom Integration', 'Service', 499.00, 28, 13972.00),
  ('Starter Plan Monthly', 'Subscription', 9.99, 2100, 20979.00),
  ('Data Export Tool', 'Addon', 14.99, 890, 13341.10),
  ('White Label License', 'License', 1999.00, 12, 23988.00);

-- Seed des activités récentes
INSERT INTO public.activities (action, description, created_at)
VALUES
  ('signup', 'New user registered', NOW() - INTERVAL '5 minutes'),
  ('upgrade', 'User upgraded to Pro plan', NOW() - INTERVAL '15 minutes'),
  ('purchase', 'New addon purchased', NOW() - INTERVAL '30 minutes'),
  ('signup', 'New user registered', NOW() - INTERVAL '1 hour'),
  ('update', 'User updated profile', NOW() - INTERVAL '2 hours'),
  ('invite', 'Team member invited', NOW() - INTERVAL '3 hours'),
  ('signup', 'New user registered', NOW() - INTERVAL '5 hours'),
  ('upgrade', 'User upgraded to Enterprise', NOW() - INTERVAL '8 hours'),
  ('purchase', 'API access purchased', NOW() - INTERVAL '12 hours'),
  ('signup', 'New user registered', NOW() - INTERVAL '1 day');

-- Success message
SELECT 'Seed data inserted successfully!' as message;
