import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrgId } from "./use-organization";

export function useAiAgent() {
  const orgId = useOrgId();
  
  return useQuery({
    queryKey: ["ai-agent", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_agents")
        .select("*")
        .eq("organization_id", orgId!)
        .eq("is_active", true)
        .order("version", { ascending: false })
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });
}
