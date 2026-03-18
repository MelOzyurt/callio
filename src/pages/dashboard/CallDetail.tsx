import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bot, User, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

const transcript = [
  { role: "AI", text: "Hi! Thanks for calling Maria's Salon. How can I help you today?", time: "0:00" },
  { role: "Caller", text: "Hi, I'd like to book a haircut for this Saturday if possible.", time: "0:05" },
  { role: "AI", text: "Of course! I have availability at 10:00 AM and 11:30 AM this Saturday. Which time works best for you?", time: "0:12" },
  { role: "Caller", text: "10 AM would be perfect.", time: "0:22" },
  { role: "AI", text: "Great! Can I get your name please?", time: "0:26" },
  { role: "Caller", text: "It's Sarah Mitchell.", time: "0:30" },
  { role: "AI", text: "Perfect, Sarah! I've booked you for a haircut this Saturday at 10:00 AM. You'll receive a confirmation text shortly. Is there anything else I can help with?", time: "0:38" },
  { role: "Caller", text: "No, that's all. Thank you!", time: "0:52" },
  { role: "AI", text: "You're welcome, Sarah! See you Saturday. Have a great day!", time: "0:56" },
];

export default function CallDetail() {
  const { id } = useParams();
  const [note, setNote] = useState("");
  const [reviewed, setReviewed] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard/calls"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-foreground">Call #{id}</h1>
          <p className="text-sm text-muted-foreground">+1 (555) 123-4567 • Today, 10:23 AM • 2:34</p>
        </div>
        <Button
          variant={reviewed ? "outline" : "default"}
          size="sm"
          onClick={() => setReviewed(!reviewed)}
        >
          {reviewed ? <CheckCircle className="mr-2 h-4 w-4 text-success" /> : <AlertCircle className="mr-2 h-4 w-4" />}
          {reviewed ? "Reviewed" : "Mark as Reviewed"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader><CardTitle className="font-display text-base">Call Summary</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">
                Caller Sarah Mitchell requested a haircut appointment for Saturday. The AI agent checked availability and booked a 10:00 AM slot. Confirmation SMS was sent automatically. Call was completed successfully with positive sentiment.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">Intent: Booking</Badge>
                <Badge variant="secondary" className="bg-success/10 text-success text-[10px]">Sentiment: Positive</Badge>
                <Badge variant="secondary" className="bg-success/10 text-success text-[10px]">Outcome: Resolved</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Transcript */}
          <Card>
            <CardHeader><CardTitle className="font-display text-base">Transcript</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {transcript.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "Caller" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${msg.role === "AI" ? "bg-primary/10" : "bg-secondary"}`}>
                    {msg.role === "AI" ? <Bot className="h-3.5 w-3.5 text-primary" /> : <User className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                  <div className={`max-w-[75%] ${msg.role === "Caller" ? "text-right" : ""}`}>
                    <div className={`inline-block rounded-xl px-4 py-2.5 text-sm ${msg.role === "AI" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}>
                      {msg.text}
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{msg.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader><CardTitle className="font-display text-base">Internal Notes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add a note about this call..."
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
              />
              <Button variant="outline" size="sm" disabled={!note.trim()}>
                <MessageSquare className="mr-2 h-3.5 w-3.5" /> Add Note
              </Button>
              <div className="space-y-2 pt-2">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">John Doe</span>
                    <span className="text-[10px] text-muted-foreground">Today, 10:45 AM</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Verified booking in calendar. Customer is a repeat client.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Call Info */}
          <Card>
            <CardHeader><CardTitle className="font-display text-base">Call Info</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Caller", value: "+1 (555) 123-4567" },
                { label: "Date", value: "Today, 10:23 AM" },
                { label: "Duration", value: "2:34" },
                { label: "Handled By", value: "AI Agent" },
                { label: "Intent", value: "Book Appointment" },
                { label: "Outcome", value: "Booking Confirmed" },
                { label: "Sentiment", value: "Positive" },
                { label: "Status", value: reviewed ? "Reviewed" : "Unreviewed" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
              <div className="pt-2">
                <Badge className="bg-success/10 text-success">Handled by AI</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions Taken */}
          <Card>
            <CardHeader><CardTitle className="font-display text-base">Actions Taken</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                "Appointment booked — Saturday 10 AM",
                "Confirmation SMS sent to caller",
                "Calendar event created",
                "Call logged in system",
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                  {a}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Business Outcome */}
          <Card>
            <CardHeader><CardTitle className="font-display text-base">Business Outcome</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">Booking Created</p>
                <p className="text-sm font-medium text-foreground">Haircut — Saturday, Mar 21</p>
                <p className="text-xs text-muted-foreground">10:00 AM • Sarah Mitchell</p>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/dashboard/actions">View in Actions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
