import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AvailabilityRule {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  capacity: number;
  is_active: boolean;
}

interface AvailabilityOverride {
  override_date: string;
  is_closed: boolean;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
}

interface Booking {
  start_at: string;
  end_at: string;
  status: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { organization_id, date, days = 7, service_id, timezone = "UTC" } = await req.json();

    if (!organization_id || !date) {
      return new Response(JSON.stringify({ error: "organization_id and date required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Calculate date range
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    // Fetch rules, overrides, and existing bookings in parallel
    const [rulesRes, overridesRes, bookingsRes] = await Promise.all([
      supabase
        .from("availability_rules")
        .select("*")
        .eq("organization_id", organization_id)
        .eq("is_active", true),
      supabase
        .from("availability_overrides")
        .select("*")
        .eq("organization_id", organization_id)
        .gte("override_date", date)
        .lte("override_date", endDate.toISOString().split("T")[0]),
      supabase
        .from("bookings")
        .select("start_at, end_at, status")
        .eq("organization_id", organization_id)
        .not("status", "in", '("cancelled","no_show")')
        .gte("start_at", startDate.toISOString())
        .lte("start_at", endDate.toISOString()),
    ]);

    if (rulesRes.error) throw rulesRes.error;
    if (overridesRes.error) throw overridesRes.error;
    if (bookingsRes.error) throw bookingsRes.error;

    const rules = rulesRes.data as AvailabilityRule[];
    const overrides = overridesRes.data as AvailabilityOverride[];
    const bookings = bookingsRes.data as Booking[];

    // Build override map by date
    const overrideMap = new Map<string, AvailabilityOverride>();
    overrides.forEach((o) => overrideMap.set(o.override_date, o));

    // Build booking count map (key = ISO datetime of slot start)
    const bookingsBySlot = new Map<string, number>();
    bookings.forEach((b) => {
      const key = b.start_at;
      bookingsBySlot.set(key, (bookingsBySlot.get(key) || 0) + 1);
    });

    // Build rules map by day_of_week
    const rulesByDay = new Map<number, AvailabilityRule>();
    rules.forEach((r) => rulesByDay.set(r.day_of_week, r));

    // Lead time: no slots in the past or within 30 min
    const now = new Date();
    const leadTimeMs = 30 * 60 * 1000;

    // Generate slots for each day
    const availability: Record<string, { slots: Array<{ start: string; end: string; available: number; booked: number }> }> = {};

    for (let d = 0; d < days; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + d);
      const dateStr = currentDate.toISOString().split("T")[0];
      const dow = currentDate.getDay(); // 0=Sun

      const override = overrideMap.get(dateStr);

      // If override is closed, no slots
      if (override?.is_closed) {
        availability[dateStr] = { slots: [] };
        continue;
      }

      const rule = rulesByDay.get(dow);
      if (!rule) {
        availability[dateStr] = { slots: [] };
        continue;
      }

      // Determine effective start/end times
      const effectiveStart = override?.start_time ?? rule.start_time;
      const effectiveEnd = override?.end_time ?? rule.end_time;

      // Parse times
      const [sh, sm] = effectiveStart.split(":").map(Number);
      const [eh, em] = effectiveEnd.split(":").map(Number);

      const slotDuration = rule.slot_duration_minutes;
      const capacity = rule.capacity;

      const slots: Array<{ start: string; end: string; available: number; booked: number }> = [];

      // Generate slots
      let slotStart = new Date(currentDate);
      slotStart.setUTCHours(sh, sm, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setUTCHours(eh, em, 0, 0);

      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);
        if (slotEnd > dayEnd) break;

        // Skip past slots (lead time check)
        if (slotStart.getTime() > now.getTime() + leadTimeMs) {
          // Count overlapping bookings for this slot
          const overlapping = bookings.filter((b) => {
            const bStart = new Date(b.start_at).getTime();
            const bEnd = new Date(b.end_at).getTime();
            const sStart = slotStart.getTime();
            const sEnd = slotEnd.getTime();
            return bStart < sEnd && bEnd > sStart;
          });

          const booked = overlapping.length;
          const available = Math.max(0, capacity - booked);

          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            available,
            booked,
          });
        }

        slotStart = slotEnd;
      }

      availability[dateStr] = { slots };
    }

    return new Response(JSON.stringify({ availability }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
