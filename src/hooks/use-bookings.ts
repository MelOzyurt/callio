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
  // joined
  customer?: { id: string; full_name: string; email: string | null; phone: string | null } | null;
  service?: { id: string; name: string } | null;
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

export function useCreateBooking() {
  const qc = useQueryClient();
  const orgId = useOrgId();
  return useMutation({
    mutationFn: async (input: {
      customer_id?: string | null;
      service_id?: string | null;
      start_at: string;
      end_at: string;
      status?: string;
      source?: string;
      notes?: string;
    }) => {
      if (!orgId) throw new Error("No organization");
      const { data, error } = await supabase
        .from("bookings")
        .insert({ ...input, organization_id: orgId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created");
    },
    onError: (e) => toast.error(e.message),
  });
}

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
