import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrgId } from "./use-organization";

export function useTranscripts() {
  const orgId = useOrgId();
  
  return useQuery({
    queryKey: ["transcripts", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transcripts")
        .select("*, calls(*)")
        .eq("organization_id", orgId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });
}

export function useTranscript(callId: string | undefined) {
  const orgId = useOrgId();
  
  return useQuery({
    queryKey: ["transcript", callId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transcripts")
        .select("*")
        .eq("call_id", callId!)
        .eq("organization_id", orgId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!callId && !!orgId,
  });
}
