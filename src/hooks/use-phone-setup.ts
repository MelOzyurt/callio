import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrgId } from "./use-organization";

export function usePhoneSetup() {
  const orgId = useOrgId();
  
  return useQuery({
    queryKey: ["phone-setup", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phone_setups")
        .select("*")
        .eq("organization_id", orgId!)
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });
}
