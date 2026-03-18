import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/api-errors";
import { requestOtp } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { phoneNumber, purpose } = await request.json();
    const result = await requestOtp(phoneNumber, purpose ?? "seller_login");
    return NextResponse.json({
      ok: true,
      phoneNumber: result.phoneNumber,
      expiresAt: result.expiresAt,
      devCode: result.devCode
    });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Could not send OTP.") }, { status: 400 });
  }
}
