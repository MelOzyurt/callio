import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, PhoneForwarded, CalendarCheck, UserPlus, ShoppingCart, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const callbacks = [
  { id: "cb1", caller: "+1 (555) 234-5678", reason: "Pricing inquiry for group booking", time: "Today, 9:45 AM", status: "pending", callId: "2" },
  { id: "cb2", caller: "+1 (555) 890-1234", reason: "Custom product order question", time: "Yesterday, 3:00 PM", status: "pending", callId: "8" },
  { id: "cb3", caller: "+1 (555) 111-2222", reason: "Warranty claim follow-up", time: "2 days ago", status: "completed", callId: "7" },
  { id: "cb4", caller: "+1 (555) 333-4444", reason: "Service complaint", time: "3 days ago", status: "completed", callId: "4" },
];

const bookings = [
  { id: "bk1", name: "Sarah Mitchell", service: "Haircut", date: "Sat, Mar 21 — 10:00 AM", status: "confirmed", callId: "1" },
  { id: "bk2", name: "James Wilson", service: "Hair Coloring", date: "Mon, Mar 23 — 2:00 PM", status: "confirmed", callId: "7" },
  { id: "bk3", name: "Emily Chen", service: "Blowout", date: "Tue, Mar 24 — 11:30 AM", status: "pending", callId: "5" },
];

const leads = [
  { id: "ld1", name: "David Park", interest: "Premium styling package", phone: "+1 (555) 567-8901", time: "Yesterday, 2:15 PM", status: "new", callId: "5" },
  { id: "ld2", name: "Lisa Johnson", interest: "Wedding party booking", phone: "+1 (555) 444-5555", time: "2 days ago", status: "contacted", callId: "3" },
  { id: "ld3", name: "Michael Brown", interest: "Monthly membership", phone: "+1 (555) 666-7777", time: "3 days ago", status: "qualified", callId: "4" },
  { id: "ld4", name: "Anna Taylor", interest: "Corporate event styling", phone: "+1 (555) 888-9999", time: "4 days ago", status: "new", callId: "6" },
];

const orders = [
  { id: "od1", customer: "Mark Davis", items: "Premium Shampoo × 1, Hair Mask × 2", total: "$88.00", time: "2 days ago", status: "confirmed", callId: "8" },
  { id: "od2", customer: "Rachel Kim", items: "Styling Gel × 3", total: "$54.00", time: "4 days ago", status: "fulfilled", callId: "4" },
];

const statusColors: Record<string, string> = {
  pending: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  confirmed: "bg-success/10 text-success",
  new: "bg-primary/10 text-primary",
  contacted: "bg-primary/10 text-primary",
  qualified: "bg-success/10 text-success",
  fulfilled: "bg-success/10 text-success",
};

export default function Actions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Actions</h1>
        <p className="text-sm text-muted-foreground">Business outcomes from your AI agent's calls — callbacks, bookings, leads, and orders.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending Callbacks", value: callbacks.filter(c => c.status === "pending").length, icon: PhoneForwarded, color: "text-primary" },
          { label: "Upcoming Bookings", value: bookings.length, icon: CalendarCheck, color: "text-success" },
          { label: "New Leads", value: leads.filter(l => l.status === "new").length, icon: UserPlus, color: "text-primary" },
          { label: "Recent Orders", value: orders.length, icon: ShoppingCart, color: "text-success" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="callbacks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="callbacks">Callbacks ({callbacks.length})</TabsTrigger>
          <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
        </TabsList>

        {/* Callbacks */}
        <TabsContent value="callbacks" className="space-y-2">
          {callbacks.map(cb => (
            <div key={cb.id} className="flex items-center gap-4 rounded-xl border bg-card p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                {cb.status === "completed" ? <CheckCircle className="h-4 w-4 text-success" /> : <Clock className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{cb.caller}</p>
                <p className="text-xs text-muted-foreground">{cb.reason}</p>
                <p className="text-[10px] text-muted-foreground">{cb.time}</p>
              </div>
              <Badge variant="secondary" className={`${statusColors[cb.status]} text-[10px]`}>{cb.status}</Badge>
              {cb.status === "pending" && <Button variant="outline" size="sm">Mark Done</Button>}
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/dashboard/calls/${cb.callId}`}><ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          ))}
        </TabsContent>

        {/* Bookings */}
        <TabsContent value="bookings" className="space-y-2">
          {bookings.map(bk => (
            <div key={bk.id} className="flex items-center gap-4 rounded-xl border bg-card p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                <CalendarCheck className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{bk.name}</p>
                <p className="text-xs text-muted-foreground">{bk.service} — {bk.date}</p>
              </div>
              <Badge variant="secondary" className={`${statusColors[bk.status]} text-[10px]`}>{bk.status}</Badge>
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/dashboard/calls/${bk.callId}`}><ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          ))}
        </TabsContent>

        {/* Leads */}
        <TabsContent value="leads" className="space-y-2">
          {leads.map(ld => (
            <div key={ld.id} className="flex items-center gap-4 rounded-xl border bg-card p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                <UserPlus className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{ld.name}</p>
                <p className="text-xs text-muted-foreground">{ld.interest}</p>
                <p className="text-[10px] text-muted-foreground">{ld.phone} • {ld.time}</p>
              </div>
              <Badge variant="secondary" className={`${statusColors[ld.status]} text-[10px]`}>{ld.status}</Badge>
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/dashboard/calls/${ld.callId}`}><ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          ))}
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders" className="space-y-2">
          {orders.map(od => (
            <div key={od.id} className="flex items-center gap-4 rounded-xl border bg-card p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                <ShoppingCart className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{od.customer}</p>
                <p className="text-xs text-muted-foreground">{od.items}</p>
                <p className="text-[10px] text-muted-foreground">{od.total} • {od.time}</p>
              </div>
              <Badge variant="secondary" className={`${statusColors[od.status]} text-[10px]`}>{od.status}</Badge>
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/dashboard/calls/${od.callId}`}><ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
