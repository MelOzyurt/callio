import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrgId } from "./use-organization";

export function useActions(type?: string) {
  const orgId = useOrgId();
  
  return useQuery({
    queryKey: ["actions", orgId, type],
    queryFn: async () => {
      let query = supabase
        .from("actions")
        .select("*, calls(*)")
        .eq("organization_id", orgId!)
        .order("created_at", { ascending: false });
      
      if (type) {
        query = query.eq("type", type);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });
}
