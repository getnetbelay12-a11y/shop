import { NextResponse } from "next/server";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";
import { createSellerSetup, getSellerStore } from "@/lib/data";
import { sellerSetupSchema } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/api-errors";

export async function GET(request: Request) {
  try {
    const user = await getMobileUserFromRequest(request);
    const store = await getSellerStore(String(user._id));
    return NextResponse.json({ store });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getMobileUserFromRequest(request);
    const payload = sellerSetupSchema.parse(await request.json());
    const store = await createSellerSetup(String(user._id), payload);
    return NextResponse.json({ store });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Could not update settings.") }, { status: 400 });
  }
}
