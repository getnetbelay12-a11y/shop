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

  function formatAuthError(message?: string) {
    if (!message) return "Could not continue right now.";
    if (message.includes("MongoDB connection string") || message.includes("MONGO_URI") || message.includes("MONGODB_URI")) {
      return "Server setup is incomplete. Add the MongoDB connection string in production environment variables and redeploy.";
    }
    return message;
  }

  async function requestCode() {
    setPending(true);
    setError("");
    setInfo("");
    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, purpose: "seller_login" })
      });
      const data = await response.json();
      setPending(false);
      if (!response.ok) {
        setError(formatAuthError(data.error || "Could not send OTP."));
        return;
      }
      setStep("verify");
      setInfo(data.devCode ? `Dev OTP: ${data.devCode}` : "OTP sent to your phone.");
    } catch {
      setPending(false);
      setError("Could not reach the server. Check the deployment health and environment configuration.");
    }
  }

  async function verifyCode() {
    setPending(true);
    setError("");
    try {
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
    } catch {
      setPending(false);
      setError("Could not verify OTP right now. Check the server configuration and try again.");
    }
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
