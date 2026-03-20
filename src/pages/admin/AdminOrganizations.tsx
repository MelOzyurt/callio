import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Loader2, Phone, PhoneCall, Calendar, Building2, MapPin, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

interface OrgRow {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  website: string | null;
  subscription_plan: string;
  status: string;
  primary_business_number: string | null;
  requested_business_number: string | null;
  created_at: string;
}

interface PhoneSetupRow {
  id: string;
  organization_id: string;
  virtual_number: string | null;
  pairing_status: string;
  routing_enabled: boolean;
  verification_status: string;
}

interface CallStats {
  total: number;
  lastCall: string | null;
}

export default function AdminOrganizations() {
  const queryClient = useQueryClient();
  const [selectedOrg, setSelectedOrg] = useState<OrgRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [virtualNumber, setVirtualNumber] = useState("");
  const [pairingStatus, setPairingStatus] = useState("unpaired");

  // Fetch all orgs
  const { data: orgs, isLoading } = useQuery({
    queryKey: ["admin-organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as OrgRow[];
    },
  });

  // Fetch all phone setups for pairing info
  const { data: phoneSetups } = useQuery({
    queryKey: ["admin-phone-setups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phone_setups")
        .select("*");
      if (error) throw error;
      return data as unknown as PhoneSetupRow[];
    },
  });

  // Fetch call stats for selected org
  const { data: callStats } = useQuery({
    queryKey: ["admin-call-stats", selectedOrg?.id],
    queryFn: async () => {
      if (!selectedOrg) return { total: 0, lastCall: null } as CallStats;
      const { count } = await supabase
        .from("calls")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", selectedOrg.id);
      const { data: lastCallData } = await supabase
        .from("calls")
        .select("started_at")
        .eq("organization_id", selectedOrg.id)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return { total: count ?? 0, lastCall: lastCallData?.started_at ?? null } as CallStats;
    },
    enabled: !!selectedOrg,
  });

  const getPhoneSetup = (orgId: string) =>
    phoneSetups?.find(ps => ps.organization_id === orgId);

  const savePairingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedOrg) throw new Error("No org selected");
      const existingSetup = getPhoneSetup(selectedOrg.id);

      const setupData = {
        organization_id: selectedOrg.id,
        virtual_number: virtualNumber || null,
        pairing_status: pairingStatus,
        paired_by_admin_at: new Date().toISOString(),
        routing_enabled: pairingStatus === "paired",
        verification_status: virtualNumber ? "provisioned" : "pending",
      };

      if (existingSetup) {
        const { error } = await supabase
          .from("phone_setups")
          .update(setupData as never)
          .eq("id", existingSetup.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("phone_setups")
          .insert(setupData as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-phone-setups"] });
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      toast.success("Pairing saved");
      setSheetOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save pairing");
    },
  });

  const openManageSheet = (org: OrgRow) => {
    setSelectedOrg(org);
    const setup = getPhoneSetup(org.id);
    setVirtualNumber(setup?.virtual_number ?? "");
    setPairingStatus((setup as unknown as Record<string, string>)?.pairing_status ?? "unpaired");
    setSheetOpen(true);
  };

  const getPairingBadge = (status: string) => {
    switch (status) {
      case "paired":
        return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-200 hover:bg-emerald-500/15 text-xs">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive" className="text-xs">Suspended</Badge>;
      default:
        return <Badge className="bg-amber-500/15 text-amber-700 border-amber-200 hover:bg-amber-500/15 text-xs">Awaiting</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Organizations</h1>
        <p className="text-sm text-muted-foreground">Manage phone number pairing and AI activation for all organizations.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : !orgs?.length ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No organizations found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Organization</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Business Number</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Virtual Number</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">AI Status</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orgs.map(org => {
                    const setup = getPhoneSetup(org.id);
                    const status = (setup as unknown as Record<string, string>)?.pairing_status ?? "unpaired";
                    return (
                      <tr key={org.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{org.name}</p>
                          <p className="text-xs text-muted-foreground">{org.industry ?? "—"}</p>
                        </td>
                        <td className="px-4 py-3">
                          {org.primary_business_number ? (
                            <span className="font-mono text-xs">{org.primary_business_number}</span>
                          ) : (
                            <Badge variant="outline" className="text-xs">Not set</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {setup?.virtual_number ? (
                            <span className="font-mono text-xs">{setup.virtual_number}</span>
                          ) : (
                            <Badge variant="outline" className="text-xs">Not paired</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {getPairingBadge(status)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="outline" size="sm" onClick={() => openManageSheet(org)}>
                            Manage
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pairing Panel Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-display">Manage — {selectedOrg?.name}</SheetTitle>
          </SheetHeader>

          {selectedOrg && (
            <div className="mt-6 space-y-6">
              {/* Client's Request */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Client's Request</h3>
                <div className="space-y-2 rounded-lg border p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-foreground">{selectedOrg.name}</span>
                    {selectedOrg.industry && (
                      <Badge variant="outline" className="text-xs">{selectedOrg.industry}</Badge>
                    )}
                  </div>
                  {selectedOrg.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{selectedOrg.location}</span>
                    </div>
                  )}
                  {selectedOrg.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{selectedOrg.website}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono">
                      {selectedOrg.primary_business_number || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Signed up {format(new Date(selectedOrg.created_at), "dd MMM yyyy")}
                    </span>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">{selectedOrg.subscription_plan}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Virtual Number Assignment */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Virtual Number Assignment</h3>

                {getPhoneSetup(selectedOrg.id)?.virtual_number && (
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Current virtual number</p>
                    <p className="font-mono text-sm font-medium">{getPhoneSetup(selectedOrg.id)?.virtual_number}</p>
                  </div>
                )}

                <div>
                  <Label>Assign virtual number</Label>
                  <Input
                    value={virtualNumber}
                    onChange={e => setVirtualNumber(e.target.value)}
                    placeholder="+44 XXXX XXXXXX"
                    className="mt-1.5 font-mono"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter the virtual number purchased from your telephony provider.
                  </p>
                </div>

                <div>
                  <Label>Pairing status</Label>
                  <Select value={pairingStatus} onValueChange={setPairingStatus}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaired">Unpaired</SelectItem>
                      <SelectItem value="paired">Paired</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={() => savePairingMutation.mutate()}
                  disabled={savePairingMutation.isPending}
                >
                  {savePairingMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Pairing
                </Button>
              </div>

              <Separator />

              {/* Call Stats */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Call Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{callStats?.total ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">Total calls</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-sm font-medium text-foreground">
                      {callStats?.lastCall
                        ? format(new Date(callStats.lastCall), "dd MMM yyyy HH:mm")
                        : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">Last call</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
