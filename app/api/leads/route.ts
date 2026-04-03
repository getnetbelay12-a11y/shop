import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { InterestLeadModel } from "@/models/InterestLead";
import { normalizePhoneNumber } from "@/lib/phone";
import { getErrorMessage } from "@/lib/api-errors";

const leadSchema = z.object({
  intent: z.enum(["seller", "buyer"]),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().trim().max(120).optional(),
  source: z.string().trim().max(40).optional(),
  storeSlug: z.string().trim().max(120).optional(),
  note: z.string().trim().max(280).optional()
}).refine((value) => Boolean(value.phoneNumber?.trim() || value.email?.trim()), {
  message: "Phone number or email is required."
});

export async function POST(request: Request) {
  try {
    const payload = leadSchema.parse(await request.json());
    await connectToDatabase();
    const phoneNumber = payload.phoneNumber?.trim() ? normalizePhoneNumber(payload.phoneNumber) : undefined;
    const lead = await InterestLeadModel.create({
      ...payload,
      phoneNumber,
      email: payload.email?.trim()?.toLowerCase()
    });
    return NextResponse.json({ ok: true, leadId: String(lead._id) });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Could not save your request.") }, { status: 400 });
  }
}
