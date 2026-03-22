import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrgId } from "@/hooks/use-organization";
import { toast } from "sonner";

export interface Customer {
  id: string;
  organization_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export function useCustomers(search?: string) {
  const orgId = useOrgId();
  return useQuery({
    queryKey: ["customers", orgId, search],
    queryFn: async () => {
      if (!orgId) return [];
      let q = supabase
        .from("customers")
        .select("*")
        .eq("organization_id", orgId)
        .order("full_name");
      if (search) q = q.ilike("full_name", `%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Customer[];
    },
    enabled: !!orgId,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  const orgId = useOrgId();
  return useMutation({
    mutationFn: async (input: { full_name: string; email?: string; phone?: string; notes?: string }) => {
      if (!orgId) throw new Error("No organization");
      const { data, error } = await supabase
        .from("customers")
        .insert({ ...input, organization_id: orgId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer added");
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; full_name?: string; email?: string; phone?: string; notes?: string }) => {
      const { error } = await supabase.from("customers").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated");
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted");
    },
    onError: (e) => toast.error(e.message),
  });
}
