import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import voigroLogo from "@/assets/voigro-logo.png";

export default function PrivacyPolicy() {
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
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-lg font-semibold">Who We Are</h2>
              <p className="text-muted-foreground">
                Voigro is an AI-powered phone assistant platform that helps businesses answer calls,
                capture leads, and manage bookings automatically. This privacy policy explains how we
                collect, use, and protect data when you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">What Data We Collect</h2>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Caller phone numbers</li>
                <li>Voice recordings of calls handled by our AI agent</li>
                <li>Call transcripts generated from voice recordings</li>
                <li>Business information provided by our clients (services, FAQs, contact details)</li>
                <li>Account information (name, email, password) for platform users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Why We Collect It</h2>
              <p className="text-muted-foreground">
                We collect this data to deliver our core service — answering and processing phone calls
                on behalf of your business. We also use call data for quality improvement, service
                analytics, and to improve the accuracy of our AI models.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">How Long We Keep It</h2>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li><strong>Voice recordings:</strong> retained for 90 days, then automatically deleted</li>
                <li><strong>Call transcripts:</strong> retained for 12 months</li>
                <li><strong>Account data:</strong> retained for the duration of your account and up to 30 days after deletion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Who We Share It With</h2>
              <p className="text-muted-foreground">
                We share data only with the service providers necessary to operate our platform:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Telephony infrastructure providers (for call routing and delivery)</li>
                <li>AI processing providers (for speech recognition and language understanding)</li>
              </ul>
              <p className="text-muted-foreground">
                We never sell your data or share it with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Your Rights</h2>
              <p className="text-muted-foreground">
                Under UK GDPR and the Data Protection Act 2018, you have the right to:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Data portability</li>
              </ul>
              <p className="text-muted-foreground">
                To exercise any of these rights, please contact us at the address below.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related enquiries, contact us at:{" "}
                <a href="mailto:privacy@voigro.com" className="font-medium text-primary hover:underline">
                  privacy@voigro.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Governing Law</h2>
              <p className="text-muted-foreground">
                This privacy policy is governed by UK GDPR and the Data Protection Act 2018.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
