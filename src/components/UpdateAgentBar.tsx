import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, CheckCircle, Loader2 } from "lucide-react";
import { useAllKnowledgeItems } from "@/hooks/use-knowledge-items";
import { useAiAgent, useUpdateAiAgent } from "@/hooks/use-ai-agent";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

interface Props {
  type: "service" | "product" | "faq";
}

function buildKnowledgeSummary(
  services: any[],
  products: any[],
  faqs: any[]
): Record<string, any> {
  return {
    services: services.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      metadata: s.metadata,
      parent_id: s.parent_id,
    })),
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      metadata: p.metadata,
      parent_id: p.parent_id,
    })),
    faqs: faqs.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
    })),
    last_synced: new Date().toISOString(),
  };
}

export default function UpdateAgentBar({ type }: Props) {
  const { data: services = [] } = useAllKnowledgeItems("service");
  const { data: products = [] } = useAllKnowledgeItems("product");
  const { data: faqs = [] } = useAllKnowledgeItems("faq");
  const { data: agent } = useAiAgent();
  const updateAgent = useUpdateAiAgent();
  const [synced, setSynced] = useState(false);

  const totalItems =
    (services?.length ?? 0) + (products?.length ?? 0) + (faqs?.length ?? 0);

  const handleSync = async () => {
    if (!agent) {
      toast.error("No AI agent found. Please create an agent first.");
      return;
    }

    try {
      const knowledgeSummary = buildKnowledgeSummary(
        services ?? [],
        products ?? [],
        faqs ?? []
      );

      await updateAgent.mutateAsync({
        id: agent.id,
        updates: {
          outcome_behaviors: {
            ...(agent.outcome_behaviors as Record<string, any>),
            knowledge_base: knowledgeSummary,
          } as unknown as Json,
        },
      });

      setSynced(true);
      toast.success("AI Agent knowledge updated successfully");
      setTimeout(() => setSynced(false), 3000);
    } catch (e: any) {
      toast.error(e.message || "Failed to update agent");
    }
  };

  const typeLabels: Record<string, string> = {
    service: "Services",
    product: "Products",
    faq: "FAQs",
  };

  return (
    <div className="sticky bottom-0 z-10 -mx-6 -mb-6 border-t bg-card/95 backdrop-blur px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Sync {typeLabels[type]} to AI Agent
            </p>
            <p className="text-xs text-muted-foreground">
              {totalItems} total knowledge items across all categories
            </p>
          </div>
        </div>
        <Button
          onClick={handleSync}
          disabled={updateAgent.isPending || synced}
          className="min-w-[160px]"
        >
          {updateAgent.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating…
            </>
          ) : synced ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" /> Agent Updated
            </>
          ) : (
            <>
              <Bot className="mr-2 h-4 w-4" /> Update Agent
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
