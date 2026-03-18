import { NextResponse } from "next/server";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";
import { getSellerStore } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const user = await getMobileUserFromRequest(request);
    const store = await getSellerStore(String(user._id));
    return NextResponse.json({
      user: {
        id: String(user._id),
        phoneNumber: user.phoneNumber,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified
      },
      store
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
