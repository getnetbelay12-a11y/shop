"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [pending, setPending] = useState(false);

  async function requestCode() {
    setPending(true);
    setError("");
    setInfo("");
    const response = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, purpose: "seller_login" })
    });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(data.error || "Could not send OTP.");
      return;
    }
    setStep("verify");
    setInfo(data.devCode ? `Dev OTP: ${data.devCode}` : "OTP sent to your phone.");
  }

  async function verifyCode() {
    setPending(true);
    setError("");
    const response = await signIn("credentials", {
      phoneNumber,
      otpCode,
      redirect: false
    });
    setPending(false);
    if (response?.error) {
      setError("Invalid or expired OTP. Request a new code.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
        Sellers sign in with phone number and one-time code. In local dev mode, the OTP is shown below after request.
      </div>
      {step === "phone" ? (
        <div className="space-y-4">
          <Input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="+251911223344" inputMode="tel" />
          <Button className="w-full" disabled={pending} onClick={requestCode}>{pending ? "Sending OTP..." : "Request OTP"}</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="+251911223344" inputMode="tel" />
          <Input value={otpCode} onChange={(event) => setOtpCode(event.target.value)} placeholder="Enter 6-digit OTP" inputMode="numeric" />
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" disabled={pending} onClick={() => setStep("phone")}>Back</Button>
            <Button disabled={pending} onClick={verifyCode}>{pending ? "Verifying..." : "Verify OTP"}</Button>
          </div>
          <button className="text-sm font-medium text-[var(--primary)]" onClick={requestCode}>
            Resend OTP
          </button>
        </div>
      )}
      {info ? <p className="text-sm text-emerald-700">{info}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
