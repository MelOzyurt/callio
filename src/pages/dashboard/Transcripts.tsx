import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const transcripts = [
  { id: "1", caller: "+1 (555) 123-4567", time: "Today, 10:23 AM", duration: "2:34", summary: "Booking confirmed for Saturday at 10 AM — haircut for Sarah Mitchell", outcome: "Booking", intent: "Book appointment", reviewed: true },
  { id: "2", caller: "+1 (555) 234-5678", time: "Today, 9:45 AM", duration: "1:12", summary: "Caller requested callback about group booking pricing", outcome: "Callback", intent: "Pricing inquiry", reviewed: false },
  { id: "3", caller: "+1 (555) 345-6789", time: "Today, 9:12 AM", duration: "4:01", summary: "Complex group booking inquiry — escalated to staff after 3 attempts", outcome: "Escalated", intent: "Group booking", reviewed: false },
  { id: "4", caller: "+1 (555) 456-7890", time: "Yesterday, 4:30 PM", duration: "1:45", summary: "Answered questions about business hours, location, and parking", outcome: "FAQ", intent: "General info", reviewed: true },
  { id: "5", caller: "+1 (555) 567-8901", time: "Yesterday, 2:15 PM", duration: "3:22", summary: "Collected contact info — interested in premium styling package", outcome: "Lead", intent: "Service inquiry", reviewed: true },
  { id: "6", caller: "+1 (555) 678-9012", time: "Yesterday, 11:00 AM", duration: "0:45", summary: "After-hours call — left voicemail, follow-up SMS sent", outcome: "Missed", intent: "Unknown", reviewed: false },
];

const outcomeColors: Record<string, string> = {
  Booking: "bg-success/10 text-success",
  Callback: "bg-primary/10 text-primary",
  Escalated: "bg-destructive/10 text-destructive",
  FAQ: "bg-secondary text-secondary-foreground",
  Lead: "bg-primary/10 text-primary",
  Missed: "bg-muted text-muted-foreground",
};

export default function Transcripts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Transcripts</h1>
        <p className="text-sm text-muted-foreground">Browse, search, and review call transcripts.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search transcripts..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Outcomes</SelectItem>
            <SelectItem value="booking">Booking</SelectItem>
            <SelectItem value="callback">Callback</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="faq">FAQ</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="unreviewed">Unreviewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {transcripts.map(t => (
          <Link key={t.id} to={`/dashboard/calls/${t.id}`} className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{t.caller}</p>
                {t.reviewed ? (
                  <CheckCircle className="h-3 w-3 text-success" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{t.summary}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <p className="text-[10px] text-muted-foreground">{t.time} • {t.duration}</p>
                <span className="text-[10px] text-muted-foreground">• Intent: {t.intent}</span>
              </div>
            </div>
            <Badge variant="secondary" className={`${outcomeColors[t.outcome]} text-[10px]`}>{t.outcome}</Badge>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
