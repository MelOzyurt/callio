import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Search, ArrowRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const calls = [
  { id: "1", caller: "+1 (555) 123-4567", duration: "2:34", time: "Today, 10:23 AM", outcome: "Booking Confirmed", action: "Appointment booked — Sat 10 AM", status: "handled", sentiment: "Positive" },
  { id: "2", caller: "+1 (555) 234-5678", duration: "1:12", time: "Today, 9:45 AM", outcome: "Callback Requested", action: "Callback task created", status: "pending", sentiment: "Neutral" },
  { id: "3", caller: "+1 (555) 345-6789", duration: "4:01", time: "Today, 9:12 AM", outcome: "Transferred to Staff", action: "Escalated — Group booking", status: "escalated", sentiment: "Frustrated" },
  { id: "4", caller: "+1 (555) 456-7890", duration: "1:45", time: "Yesterday, 4:30 PM", outcome: "FAQ Answered", action: "Answered hours & location", status: "handled", sentiment: "Positive" },
  { id: "5", caller: "+1 (555) 567-8901", duration: "3:22", time: "Yesterday, 2:15 PM", outcome: "Lead Captured", action: "Contact info collected", status: "handled", sentiment: "Positive" },
  { id: "6", caller: "+1 (555) 678-9012", duration: "0:45", time: "Yesterday, 11:00 AM", outcome: "Missed — After Hours", action: "Follow-up SMS sent", status: "missed", sentiment: "—" },
  { id: "7", caller: "+1 (555) 789-0123", duration: "2:10", time: "2 days ago", outcome: "Booking Confirmed", action: "Appointment booked — Mon 2 PM", status: "handled", sentiment: "Positive" },
  { id: "8", caller: "+1 (555) 890-1234", duration: "1:58", time: "2 days ago", outcome: "Order Placed", action: "Product order — 2 items", status: "handled", sentiment: "Neutral" },
];

const statusStyles: Record<string, string> = {
  handled: "bg-success/10 text-success",
  pending: "bg-primary/10 text-primary",
  escalated: "bg-destructive/10 text-destructive",
  missed: "bg-muted text-muted-foreground",
};

export default function CallHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Calls</h1>
        <p className="text-sm text-muted-foreground">View and manage all incoming calls and their outcomes.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by number or outcome..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="handled">Handled</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Outcome" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Outcomes</SelectItem>
            <SelectItem value="booking">Booking</SelectItem>
            <SelectItem value="callback">Callback</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="faq">FAQ</SelectItem>
            <SelectItem value="order">Order</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="today">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Call List */}
      <div className="space-y-2">
        {calls.map(call => (
          <Link
            key={call.id}
            to={`/dashboard/calls/${call.id}`}
            className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{call.caller}</p>
                <span className="text-[10px] text-muted-foreground">• {call.duration}</span>
              </div>
              <p className="text-xs text-muted-foreground">{call.action}</p>
              <p className="text-[10px] text-muted-foreground">{call.time}</p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1">
              <Badge variant="secondary" className={`${statusStyles[call.status]} text-[10px]`}>{call.outcome}</Badge>
              {call.sentiment !== "—" && (
                <span className="text-[10px] text-muted-foreground">{call.sentiment}</span>
              )}
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
