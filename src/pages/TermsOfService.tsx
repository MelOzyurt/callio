import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import voigroLogo from "@/assets/voigro-logo.png";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={voigroLogo} alt="Voigro" className="h-8 w-8" />
            <span className="font-display text-xl font-bold text-foreground">Voigro</span>
          </Link>
        </div>
      </nav>

      <div className="container max-w-3xl py-12">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-lg font-semibold">Service Description</h2>
              <p className="text-muted-foreground">
                Voigro provides an AI-powered phone answering platform that enables businesses to
                automate call handling, appointment booking, lead capture, and customer enquiry
                management through intelligent voice agents.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Acceptable Use</h2>
              <p className="text-muted-foreground">
                Voigro is intended for legitimate business use only. You may not use the service for
                any illegal, fraudulent, or harmful activity. Specifically, you agree not to:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Use the service for harassment, threats, or abusive communications</li>
                <li>Misrepresent the nature of the AI agent to callers in a deceptive manner</li>
                <li>Use the service to conduct illegal activities or facilitate unlawful transactions</li>
                <li>Attempt to reverse-engineer, exploit, or disrupt the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Client Responsibilities</h2>
              <p className="text-muted-foreground">As a Voigro client, you are responsible for:</p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Informing your own customers that calls may be handled by an AI assistant</li>
                <li>Complying with all local and national call recording consent laws applicable to your jurisdiction</li>
                <li>Ensuring your use of the platform does not violate any applicable regulations</li>
                <li>Maintaining accurate and up-to-date business information within the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Our Responsibilities</h2>
              <p className="text-muted-foreground">Voigro commits to:</p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Providing reasonable uptime and service availability</li>
                <li>Implementing appropriate data security measures</li>
                <li>Complying with UK GDPR and the Data Protection Act 2018</li>
                <li>Notifying clients promptly of any data breaches affecting their information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Voigro shall not be liable for any indirect, incidental, special, or consequential
                damages arising from the use of our service, including but not limited to lost revenue,
                missed calls due to service outages, or inaccuracies in AI-generated responses.
                Our total liability shall not exceed the fees paid by you in the twelve months preceding
                the claim.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Subscription and Billing</h2>
              <p className="text-muted-foreground">
                Subscriptions are billed on a monthly basis. Usage beyond your plan's included
                allowance will be charged at the applicable overage rate. You may cancel your
                subscription at any time; cancellation takes effect at the end of the current billing
                period.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Termination</h2>
              <p className="text-muted-foreground">
                Either party may terminate this agreement with 30 days' written notice. Voigro reserves
                the right to suspend or terminate accounts that violate these terms immediately and
                without notice. Upon termination, your data will be retained in accordance with our
                Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Governing Law</h2>
              <p className="text-muted-foreground">
                These terms are governed by and construed in accordance with the laws of England and
                Wales. Any disputes arising under these terms shall be subject to the exclusive
                jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Contact</h2>
              <p className="text-muted-foreground">
                For questions about these terms, contact us at:{" "}
                <a href="mailto:legal@voigro.com" className="font-medium text-primary hover:underline">
                  legal@voigro.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
