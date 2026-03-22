
-- ═══════════════════════════════════════════
-- CUSTOMERS
-- ═══════════════════════════════════════════
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  notes text,
  tags text[] DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org customers"
  ON public.customers FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id(auth.uid()));

CREATE POLICY "Users can manage org customers"
  ON public.customers FOR ALL TO authenticated
  USING (organization_id = get_user_org_id(auth.uid()))
  WITH CHECK (organization_id = get_user_org_id(auth.uid()));

CREATE TRIGGER set_updated_at_customers
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_customers_org ON public.customers(organization_id);
CREATE INDEX idx_customers_email ON public.customers(organization_id, email);

-- ═══════════════════════════════════════════
-- AVAILABILITY RULES (weekly schedule)
-- ═══════════════════════════════════════════
CREATE TABLE public.availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration_minutes integer NOT NULL DEFAULT 30,
  capacity integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, day_of_week)
);

ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org availability rules"
  ON public.availability_rules FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id(auth.uid()));

CREATE POLICY "Owners can manage availability rules"
  ON public.availability_rules FOR ALL TO authenticated
  USING (organization_id = get_user_org_id(auth.uid()) AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'staff'::app_role)))
  WITH CHECK (organization_id = get_user_org_id(auth.uid()) AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'staff'::app_role)));

CREATE TRIGGER set_updated_at_availability_rules
  BEFORE UPDATE ON public.availability_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_availability_rules_org ON public.availability_rules(organization_id);

-- ═══════════════════════════════════════════
-- AVAILABILITY OVERRIDES (date-specific exceptions)
-- ═══════════════════════════════════════════
CREATE TABLE public.availability_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  override_date date NOT NULL,
  is_closed boolean NOT NULL DEFAULT false,
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, override_date)
);

ALTER TABLE public.availability_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org availability overrides"
  ON public.availability_overrides FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id(auth.uid()));

CREATE POLICY "Owners can manage availability overrides"
  ON public.availability_overrides FOR ALL TO authenticated
  USING (organization_id = get_user_org_id(auth.uid()) AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'staff'::app_role)))
  WITH CHECK (organization_id = get_user_org_id(auth.uid()) AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'staff'::app_role)));

CREATE TRIGGER set_updated_at_availability_overrides
  BEFORE UPDATE ON public.availability_overrides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_availability_overrides_org_date ON public.availability_overrides(organization_id, override_date);

-- ═══════════════════════════════════════════
-- BOOKINGS
-- ═══════════════════════════════════════════
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  service_id uuid REFERENCES public.knowledge_items(id) ON DELETE SET NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'online', 'phone', 'ai_agent')),
  notes text,
  cancellation_reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id(auth.uid()));

CREATE POLICY "Users can manage org bookings"
  ON public.bookings FOR ALL TO authenticated
  USING (organization_id = get_user_org_id(auth.uid()))
  WITH CHECK (organization_id = get_user_org_id(auth.uid()));

CREATE TRIGGER set_updated_at_bookings
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_bookings_org ON public.bookings(organization_id);
CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_start ON public.bookings(organization_id, start_at);
CREATE INDEX idx_bookings_status ON public.bookings(organization_id, status);
