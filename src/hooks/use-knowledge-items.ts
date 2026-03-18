import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrgId } from "./use-organization";

export function useKnowledgeItems(type: "service" | "product" | "faq") {
  const orgId = useOrgId();
  
  return useQuery({
    queryKey: ["knowledge-items", orgId, type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_items")
        .select("*")
        .eq("organization_id", orgId!)
        .eq("type", type)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });
}
