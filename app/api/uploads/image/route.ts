import { NextResponse } from "next/server";
import { configureCloudinary, cloudinary } from "@/lib/cloudinary";
import { getMobileUserFromRequest } from "@/lib/mobile-auth";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    await getMobileUserFromRequest(request);
    const { dataUri, fileName } = await request.json();
    if (!env.CLOUDINARY) {
      return NextResponse.json({ error: "Cloudinary is not configured. Use an image URL instead." }, { status: 400 });
    }
    configureCloudinary();
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "shop/mobile",
      public_id: fileName?.replace(/\.[^.]+$/, "") || undefined
    });
    return NextResponse.json({ url: result.secure_url });
  } catch {
    return NextResponse.json({ error: "Could not upload image." }, { status: 400 });
  }
}
