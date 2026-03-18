import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <Shell>
      <main className="mx-auto max-w-md px-4 py-16">
        <Card className="p-6">
          <h1 className="text-3xl font-bold">Start with your phone number</h1>
          <p className="mt-2 text-sm text-stone-600">Request an OTP, verify, then complete seller onboarding.</p>
          <div className="mt-6">
            <SignupForm />
          </div>
          <p className="mt-4 text-sm text-stone-600">
            Already have a code? <Link href="/login" className="font-semibold text-[var(--primary)]">Go to login</Link>
          </p>
        </Card>
      </main>
    </Shell>
  );
}
