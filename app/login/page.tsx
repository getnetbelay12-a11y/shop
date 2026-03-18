import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <Shell>
      <main className="mx-auto max-w-md px-4 py-16">
        <Card className="p-6">
          <h1 className="text-3xl font-bold">Phone login</h1>
          <p className="mt-2 text-sm text-stone-600">Seller and admin access by phone number and OTP.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
          <p className="mt-4 text-sm text-stone-600">
            First time? <Link href="/signup" className="font-semibold text-[var(--primary)]">Request a code and continue</Link>
          </p>
        </Card>
      </main>
    </Shell>
  );
}
