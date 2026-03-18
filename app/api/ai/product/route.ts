import { NextResponse } from "next/server";
import { generateBilingualContent, rewriteDescription, suggestTags } from "@/lib/ai";
import { getRequiredApiSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    await getRequiredApiSession();
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
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}
