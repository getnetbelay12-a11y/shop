import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/api-errors";
import { createSellerSetup, getSellerStore } from "@/lib/data";
import { getRequiredApiSession } from "@/lib/session";
import { sellerSetupSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const session = await getRequiredApiSession();
    const store = await getSellerStore(session.user.id);
    return NextResponse.json({ store });
  } catch {
    return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getRequiredApiSession();
    const payload = sellerSetupSchema.parse(await request.json());
    const store = await createSellerSetup(session.user.id, payload);
    return NextResponse.json({ store });
  } catch (error) {
    const message = getErrorMessage(error, "Could not save store.");
    return NextResponse.json({ error: message }, { status: message === "Please log in to continue." ? 401 : 400 });
  }
}
