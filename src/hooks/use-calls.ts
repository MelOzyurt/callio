import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrgId } from "./use-organization";

export function useCalls() {
  const orgId = useOrgId();
  
  return useQuery({
    queryKey: ["calls", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .eq("organization_id", orgId!)
        .order("started_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });
}

export function useCall(id: string | undefined) {
  const orgId = useOrgId();
  
  return useQuery({
    queryKey: ["call", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .eq("id", id!)
        .eq("organization_id", orgId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!orgId,
  });
}
