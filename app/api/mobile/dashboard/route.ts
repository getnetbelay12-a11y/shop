import { NextResponse } from "next/server";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";
import { getDashboardMetrics } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const user = await getMobileUserFromRequest(request);
    const metrics = await getDashboardMetrics(String(user._id));
    return NextResponse.json({ metrics });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
