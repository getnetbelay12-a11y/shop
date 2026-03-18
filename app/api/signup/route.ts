import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Seller signup now uses phone number and OTP from /login." }, { status: 410 });
}
