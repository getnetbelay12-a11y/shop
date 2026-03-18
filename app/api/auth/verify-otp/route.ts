import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/api-errors";
import { createMobileSession } from "@/lib/mobile-auth";
import { consumeOtp } from "@/lib/otp";
import { normalizePhoneNumber } from "@/lib/phone";
import { findOrCreatePhoneUser } from "@/lib/user-auth";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  try {
    const { phoneNumber, otpCode, purpose } = await request.json();
    await consumeOtp(phoneNumber, otpCode, purpose ?? "seller_login");
    const normalized = normalizePhoneNumber(phoneNumber);
    const existing = (await UserModel.findOne({ phoneNumber: normalized }).lean()) as any;
    const user = existing?.role === "admin"
      ? existing
      : await findOrCreatePhoneUser(normalized, "seller");
    const mobileToken = await createMobileSession(String(user._id));
    return NextResponse.json({
      ok: true,
      mobileToken,
      user: {
        id: String(user._id),
        phoneNumber: user.phoneNumber,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Could not verify OTP.") }, { status: 400 });
  }
}
