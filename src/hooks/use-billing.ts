import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrgId } from "./use-organization";

export function useBillingAccount() {
  const orgId = useOrgId();
  
  return useQuery({
    queryKey: ["billing-account", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("billing_accounts")
        .select("*")
        .eq("organization_id", orgId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });
}

export function useInvoices() {
  const orgId = useOrgId();
  
  return useQuery({
    queryKey: ["invoices", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("organization_id", orgId!)
        .order("period_start", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });
}
