import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Download, ArrowUpRight } from "lucide-react";

const invoices = [
  { id: "INV-005", date: "Mar 1, 2026", amount: "$149.00", overage: "$0.00", total: "$149.00", status: "Upcoming" },
  { id: "INV-004", date: "Feb 1, 2026", amount: "$149.00", overage: "$12.50", total: "$161.50", status: "Paid" },
  { id: "INV-003", date: "Jan 1, 2026", amount: "$149.00", overage: "$0.00", total: "$149.00", status: "Paid" },
  { id: "INV-002", date: "Dec 1, 2025", amount: "$49.00", overage: "$0.00", total: "$49.00", status: "Paid" },
];

export default function Billing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground">Manage your subscription, usage, and payment details.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Plan */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="font-display text-base">Current Plan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-foreground">Professional</span>
                  <Badge className="bg-success/10 text-success text-[10px]">Active</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">500 calls/month included • 3 phone numbers • Priority support</p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-bold text-foreground">$149</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </div>

            {/* Usage */}
            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-medium text-foreground">Monthly Usage</p>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Calls used</span>
                  <span className="font-medium text-foreground">342 / 500 included</span>
                </div>
                <Progress value={68} className="h-2" />
                <p className="mt-1 text-xs text-muted-foreground">158 calls remaining • Resets Apr 1, 2026</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 pt-2">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Included</p>
                  <p className="text-sm font-semibold text-foreground">500 calls</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Overage Used</p>
                  <p className="text-sm font-semibold text-foreground">0 calls</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Overage Rate</p>
                  <p className="text-sm font-semibold text-foreground">$0.25 / call</p>
                </div>
              </div>
            </div>

            {/* Estimated Next Invoice */}
            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Estimated Next Invoice</p>
                  <p className="text-xs text-muted-foreground">Due Apr 1, 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-foreground">~$149.00</p>
                  <p className="text-[10px] text-muted-foreground">$149.00 subscription + $0.00 overage</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline">Change Plan</Button>
              <Button variant="ghost">Cancel Subscription</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-display text-base">Payment Method</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2027</p>
                </div>
              </div>
              <Button variant="outline" className="mt-3 w-full" size="sm">Update Payment Method</Button>
            </CardContent>
          </Card>

          {/* Plan Comparison */}
          <Card>
            <CardHeader><CardTitle className="font-display text-base">Available Plans</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "Starter", price: "$49/mo", calls: "100 calls", current: false },
                { name: "Professional", price: "$149/mo", calls: "500 calls", current: true },
                { name: "Enterprise", price: "Custom", calls: "Unlimited", current: false },
              ].map((plan, i) => (
                <div key={i} className={`flex items-center justify-between rounded-lg border p-3 ${plan.current ? "border-primary bg-primary/5" : ""}`}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">{plan.calls}/month</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{plan.price}</span>
                    {plan.current && <Badge className="bg-primary/10 text-primary text-[10px]">Current</Badge>}
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground pt-1">All plans include pay-as-you-go overage at $0.25/call beyond your included allowance.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader><CardTitle className="font-display text-base">Invoices</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground w-20">{inv.id}</span>
                  <span className="text-sm text-muted-foreground">{inv.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-muted-foreground">
                      {inv.overage !== "$0.00" ? `${inv.amount} + ${inv.overage} overage` : inv.amount}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground w-20 text-right">{inv.total}</span>
                  <Badge variant="secondary" className={`text-[10px] w-20 justify-center ${inv.status === "Paid" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                    {inv.status}
                  </Badge>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
