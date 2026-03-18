import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getLatestDevOtp } from "@/lib/otp";

export async function GET(request: Request) {
  if (env.OTP_PROVIDER !== "dev") {
    return NextResponse.json({ error: "Dev OTP lookup is disabled." }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const phoneNumber = searchParams.get("phoneNumber");
  if (!phoneNumber) {
    return NextResponse.json({ error: "phoneNumber is required." }, { status: 400 });
  }
  const otp = await getLatestDevOtp(phoneNumber);
  return NextResponse.json({ phoneNumber, code: otp?.code ?? null, expiresAt: otp?.expiresAt ?? null });
}
