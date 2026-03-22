import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrgId } from "@/hooks/use-organization";
import { toast } from "sonner";

export interface AvailabilityRule {
  id: string;
  organization_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityOverride {
  id: string;
  organization_id: string;
  override_date: string;
  is_closed: boolean;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

export function useAvailabilityRules() {
  const orgId = useOrgId();
  return useQuery({
    queryKey: ["availability-rules", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("availability_rules")
        .select("*")
        .eq("organization_id", orgId)
        .order("day_of_week");
      if (error) throw error;
      return (data ?? []) as AvailabilityRule[];
    },
    enabled: !!orgId,
  });
}

export function useUpsertAvailabilityRule() {
  const qc = useQueryClient();
  const orgId = useOrgId();
  return useMutation({
    mutationFn: async (input: { day_of_week: number; start_time: string; end_time: string; slot_duration_minutes?: number; capacity?: number; is_active?: boolean }) => {
      if (!orgId) throw new Error("No organization");
      const { error } = await supabase
        .from("availability_rules")
        .upsert({ ...input, organization_id: orgId }, { onConflict: "organization_id,day_of_week" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["availability-rules"] });
      toast.success("Availability updated");
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useAvailabilityOverrides(month?: string) {
  const orgId = useOrgId();
  return useQuery({
    queryKey: ["availability-overrides", orgId, month],
    queryFn: async () => {
      if (!orgId) return [];
      let q = supabase
        .from("availability_overrides")
        .select("*")
        .eq("organization_id", orgId)
        .order("override_date");
      if (month) {
        q = q.gte("override_date", `${month}-01`).lte("override_date", `${month}-31`);
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as AvailabilityOverride[];
    },
    enabled: !!orgId,
  });
}

export function useUpsertAvailabilityOverride() {
  const qc = useQueryClient();
  const orgId = useOrgId();
  return useMutation({
    mutationFn: async (input: { override_date: string; is_closed?: boolean; start_time?: string; end_time?: string; reason?: string }) => {
      if (!orgId) throw new Error("No organization");
      const { error } = await supabase
        .from("availability_overrides")
        .upsert({ ...input, organization_id: orgId }, { onConflict: "organization_id,override_date" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["availability-overrides"] });
      toast.success("Override saved");
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteAvailabilityOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("availability_overrides").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["availability-overrides"] });
      toast.success("Override removed");
    },
    onError: (e) => toast.error(e.message),
  });
}
