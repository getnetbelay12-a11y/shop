import { NextResponse } from "next/server";
import { generateBilingualContent, rewriteDescription, suggestTags } from "@/lib/ai";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";

export async function POST(request: Request) {
  try {
    await getMobileUserFromRequest(request);
    const payload = await request.json();
    if (payload.type === "rewrite") {
      return NextResponse.json({ result: await rewriteDescription(payload.description) });
    }
    if (payload.type === "tags") {
      return NextResponse.json({ result: await suggestTags(payload.description) });
    }
    if (payload.type === "bilingual") {
      return NextResponse.json({ result: await generateBilingualContent(payload.title, payload.description) });
    }
    return NextResponse.json({ error: "Unsupported AI action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
