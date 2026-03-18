import { NextResponse } from "next/server";
import { APP_NAME } from "@/config/app";
import { getServiceStatus } from "@/lib/service-status";

export async function GET() {
  const services = await getServiceStatus();
  const ok = services.every((service) => service.mode !== "error");

  return NextResponse.json({
    ok,
    app: APP_NAME,
    timestamp: new Date().toISOString(),
    services
  }, { status: ok ? 200 : 503 });
}
