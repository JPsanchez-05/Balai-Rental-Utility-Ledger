-- ==============================================================================
-- SUPABASE SECURITY FIX: Enable Row Level Security (RLS) & Policies
-- Resolves: "RLS Disabled in Public" for settings, expenses, rooms, payments
-- ==============================================================================

-- 1. Enable Row Level Security on all public tables
ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.expenses ENABLE ROW LEVEL SECURITY;

-- 2. (Optional / Recommended) Add explicit access policies:
-- Since your app communicates via the backend server (using DATABASE_URL with the postgres role),
-- the postgres/service_role automatically bypasses RLS.
-- Adding these policies ensures that authenticated users or service roles have clean, explicit permissions
-- while blocking unauthorized anonymous public tampering via PostgREST:

-- Settings Policies
DROP POLICY IF EXISTS "Allow authenticated read on settings" ON public.settings;
CREATE POLICY "Allow authenticated read on settings"
  ON public.settings
  FOR SELECT
  TO authenticated, service_role
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated modify on settings" ON public.settings;
CREATE POLICY "Allow authenticated modify on settings"
  ON public.settings
  FOR ALL
  TO authenticated, service_role
  USING (true);

-- Rooms Policies
DROP POLICY IF EXISTS "Allow authenticated read on rooms" ON public.rooms;
CREATE POLICY "Allow authenticated read on rooms"
  ON public.rooms
  FOR SELECT
  TO authenticated, service_role
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated modify on rooms" ON public.rooms;
CREATE POLICY "Allow authenticated modify on rooms"
  ON public.rooms
  FOR ALL
  TO authenticated, service_role
  USING (true);

-- Payments Policies
DROP POLICY IF EXISTS "Allow authenticated read on payments" ON public.payments;
CREATE POLICY "Allow authenticated read on payments"
  ON public.payments
  FOR SELECT
  TO authenticated, service_role
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated modify on payments" ON public.payments;
CREATE POLICY "Allow authenticated modify on payments"
  ON public.payments
  FOR ALL
  TO authenticated, service_role
  USING (true);

-- Expenses Policies
DROP POLICY IF EXISTS "Allow authenticated read on expenses" ON public.expenses;
CREATE POLICY "Allow authenticated read on expenses"
  ON public.expenses
  FOR SELECT
  TO authenticated, service_role
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated modify on expenses" ON public.expenses;
CREATE POLICY "Allow authenticated modify on expenses"
  ON public.expenses
  FOR ALL
  TO authenticated, service_role
  USING (true);
