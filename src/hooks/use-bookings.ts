import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrgId } from "@/hooks/use-organization";
import { toast } from "sonner";

export interface Booking {
  id: string;
  organization_id: string;
  customer_id: string | null;
  service_id: string | null;
  start_at: string;
  end_at: string;
  status: string;
  source: string;
  notes: string | null;
  cancellation_reason: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  customer?: { id: string; full_name: string; email: string | null; phone: string | null } | null;
  service?: { id: string; name: string } | null;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  available: number;
  booked: number;
}

export function useBookings(filters?: { status?: string; from?: string; to?: string }) {
  const orgId = useOrgId();
  return useQuery({
    queryKey: ["bookings", orgId, filters],
    queryFn: async () => {
      if (!orgId) return [];
      let q = supabase
        .from("bookings")
        .select("*, customer:customers(id, full_name, email, phone), service:knowledge_items(id, name)")
        .eq("organization_id", orgId)
        .order("start_at", { ascending: true });
      if (filters?.status) q = q.eq("status", filters.status);
      if (filters?.from) q = q.gte("start_at", filters.from);
      if (filters?.to) q = q.lte("start_at", filters.to);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Booking[];
    },
    enabled: !!orgId,
  });
}

/** Fetch available slots via the get-availability edge function */
export function useAvailableSlots(date: string, days = 7) {
  const orgId = useOrgId();
  return useQuery({
    queryKey: ["available-slots", orgId, date, days],
    queryFn: async () => {
      if (!orgId) return {};
      const { data, error } = await supabase.functions.invoke("get-availability", {
        body: { organization_id: orgId, date, days },
      });
      if (error) throw error;
      return (data?.availability ?? {}) as Record<string, { slots: AvailabilitySlot[] }>;
    },
    enabled: !!orgId && !!date,
  });
}

/** Create booking via edge function with capacity check */
export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      customer_id?: string | null;
      service_id?: string | null;
      start_at: string;
      end_at: string;
      source?: string;
      notes?: string;
    }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("create-booking", {
        body: input,
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.message || data.error);
      return data.booking;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["available-slots"] });
      toast.success("Booking created");
    },
    onError: (e) => toast.error(e.message),
  });
}

/** Cancel booking via edge function with policy enforcement */
export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ booking_id, reason }: { booking_id: string; reason?: string }) => {
      const { data, error } = await supabase.functions.invoke("cancel-booking", {
        body: { booking_id, reason },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.message || data.error);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["available-slots"] });
      toast.success("Booking cancelled");
    },
    onError: (e) => toast.error(e.message),
  });
}

/** Direct update for status changes like completing, no-show etc. */
export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string; notes?: string; cancellation_reason?: string; start_at?: string; end_at?: string }) => {
      const { error } = await supabase.from("bookings").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking updated");
    },
    onError: (e) => toast.error(e.message),
  });
}
