
CREATE OR REPLACE FUNCTION public.create_booking_with_capacity_check(
  p_organization_id uuid,
  p_customer_id uuid,
  p_service_id uuid,
  p_start_at timestamptz,
  p_end_at timestamptz,
  p_source text DEFAULT 'manual',
  p_notes text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_day_of_week integer;
  v_start_time time;
  v_end_time time;
  v_rule availability_rules%ROWTYPE;
  v_override availability_overrides%ROWTYPE;
  v_concurrent_count integer;
  v_booking_id uuid;
BEGIN
  -- Extract day-of-week and time from the requested slot
  v_day_of_week := EXTRACT(DOW FROM p_start_at);
  v_start_time := p_start_at::time;
  v_end_time := p_end_at::time;

  -- Check for date override (closed day)
  SELECT * INTO v_override
  FROM availability_overrides
  WHERE organization_id = p_organization_id
    AND override_date = p_start_at::date;

  IF FOUND AND v_override.is_closed THEN
    RETURN jsonb_build_object('error', 'closed_day', 'message', 'This date is marked as closed');
  END IF;

  -- Check availability rule exists and is active
  SELECT * INTO v_rule
  FROM availability_rules
  WHERE organization_id = p_organization_id
    AND day_of_week = v_day_of_week
    AND is_active = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'no_availability', 'message', 'No availability rule for this day');
  END IF;

  -- Use override times if available, otherwise use rule times
  DECLARE
    v_avail_start time;
    v_avail_end time;
  BEGIN
    IF v_override.start_time IS NOT NULL THEN
      v_avail_start := v_override.start_time;
      v_avail_end := COALESCE(v_override.end_time, v_rule.end_time);
    ELSE
      v_avail_start := v_rule.start_time;
      v_avail_end := v_rule.end_time;
    END IF;

    -- Validate requested time is within available window
    IF v_start_time < v_avail_start OR v_end_time > v_avail_end THEN
      RETURN jsonb_build_object('error', 'outside_hours', 'message', 'Requested time is outside available hours');
    END IF;
  END;

  -- Check capacity (concurrent bookings in the same time range)
  SELECT COUNT(*) INTO v_concurrent_count
  FROM bookings
  WHERE organization_id = p_organization_id
    AND status NOT IN ('cancelled', 'no_show')
    AND tstzrange(start_at, end_at, '[)') && tstzrange(p_start_at, p_end_at, '[)');

  IF v_concurrent_count >= v_rule.capacity THEN
    RETURN jsonb_build_object('error', 'capacity_full', 'message', 'This time slot is fully booked');
  END IF;

  -- Insert the booking
  INSERT INTO bookings (organization_id, customer_id, service_id, start_at, end_at, source, notes, metadata, status)
  VALUES (p_organization_id, p_customer_id, p_service_id, p_start_at, p_end_at, p_source, p_notes, p_metadata, 'confirmed')
  RETURNING id INTO v_booking_id;

  RETURN jsonb_build_object('id', v_booking_id, 'status', 'confirmed');
END;
$$;
