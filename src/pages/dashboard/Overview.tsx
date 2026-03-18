import {
  Phone, PhoneMissed, Bot, PhoneForwarded, CalendarCheck, UserPlus,
  ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, CreditCard,
  CheckCircle, Circle, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const metrics = [
  { title: "Total Calls", value: "1,247", change: "+12%", up: true, icon: Phone, period: "This month" },
  { title: "AI Handled", value: "1,180", change: "+15%", up: true, icon: Bot, period: "95% of total" },
  { title: "Missed Calls", value: "23", change: "-8%", up: false, icon: PhoneMissed, period: "2% of total" },
  { title: "Callbacks", value: "44", change: "+3%", up: true, icon: PhoneForwarded, period: "12 pending" },
  { title: "Bookings", value: "89", change: "+22%", up: true, icon: CalendarCheck, period: "This month" },
  { title: "Leads Captured", value: "156", change: "+18%", up: true, icon: UserPlus, period: "This month" },
];

const recentTranscripts = [
  { id: "1", caller: "+1 (555) 123-4567", time: "5 min ago", outcome: "Booking Confirmed", status: "handled" },
  { id: "2", caller: "+1 (555) 234-5678", time: "12 min ago", outcome: "Callback Requested", status: "pending" },
  { id: "3", caller: "+1 (555) 345-6789", time: "28 min ago", outcome: "Transferred to Staff", status: "escalated" },
  { id: "4", caller: "+1 (555) 456-7890", time: "1 hr ago", outcome: "Lead Captured", status: "handled" },
  { id: "5", caller: "+1 (555) 567-8901", time: "2 hr ago", outcome: "FAQ Answered", status: "handled" },
];

const unresolvedItems = [
  { type: "Callback", text: "Callback requested by +1 (555) 234-5678 — Pricing inquiry", time: "12 min ago" },
  { type: "Escalation", text: "Call transferred — Group booking inquiry not resolved", time: "28 min ago" },
  { type: "Callback", text: "Callback requested by +1 (555) 890-1234 — Custom order", time: "3 hr ago" },
];

const setupChecklist = [
  { label: "Create your account", done: true },
  { label: "Add business details", done: true },
  { label: "Configure AI agent", done: true },
  { label: "Add services & FAQs", done: false },
  { label: "Connect phone number", done: false },
  { label: "Make a test call", done: false },
];

const statusColors: Record<string, string> = {
  handled: "bg-success/10 text-success",
  pending: "bg-primary/10 text-primary",
  escalated: "bg-destructive/10 text-destructive",
};

export default function DashboardOverview() {
  const completedSteps = setupChecklist.filter(s => s.done).length;
  const totalSteps = setupChecklist.length;
  const setupComplete = completedSteps === totalSteps;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">Your AI agent performance and business activity at a glance.</p>
      </div>

      {/* Onboarding Progress — only if incomplete */}
      {!setupComplete && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Complete your setup</p>
                <p className="text-xs text-muted-foreground">{completedSteps} of {totalSteps} steps done — finish to go live</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/support">View Checklist <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            <Progress value={(completedSteps / totalSteps) * 100} className="h-2" />
            <div className="mt-3 flex flex-wrap gap-3">
              {setupChecklist.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {s.done ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <Circle className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span className={`text-xs ${s.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m, i) => (
          <Card key={i} className="border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{m.title}</span>
                <m.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-foreground">{m.value}</span>
                <span className={`flex items-center text-xs font-medium ${m.up ? "text-success" : "text-destructive"}`}>
                  {m.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {m.change}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">{m.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transcripts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base">Recent Calls</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/calls">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentTranscripts.map(t => (
              <Link key={t.id} to={`/dashboard/calls/${t.id}`} className="flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/30">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.caller}</p>
                  <p className="text-xs text-muted-foreground">{t.time}</p>
                </div>
                <Badge variant="secondary" className={`shrink-0 text-[10px] ${statusColors[t.status]}`}>
                  {t.outcome}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Unresolved Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-base">Needs Attention</CardTitle>
              <Badge variant="secondary" className="bg-destructive/10 text-destructive text-[10px]">{unresolvedItems.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {unresolvedItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg border bg-background p-3">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{item.text}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{item.type} • {item.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/dashboard/actions">View All Actions</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Billing Snapshot */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-base">Usage & Billing</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Plan</span>
                <span className="text-xs font-semibold text-foreground">Professional — $149/mo</span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Calls used</span>
                  <span className="font-medium text-foreground">342 / 500</span>
                </div>
                <Progress value={68} className="h-1.5" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Overage charges</span>
                <span className="text-xs font-medium text-foreground">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Next invoice</span>
                <span className="text-xs font-medium text-foreground">~$149.00 on Apr 1</span>
              </div>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/dashboard/billing">Manage Billing</Link>
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "AI Agent", status: "Active", ok: true },
                { label: "Phone Line", status: "Connected", ok: true },
                { label: "Booking System", status: "Active", ok: true },
                { label: "Transcription", status: "Active", ok: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{s.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.ok ? "bg-success" : "bg-destructive"}`} />
                    <span className="text-xs text-muted-foreground">{s.status}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-xs text-success font-medium">All systems operational</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
