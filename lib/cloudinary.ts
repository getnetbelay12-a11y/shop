import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

let configured = false;

export function configureCloudinary() {
  if (configured || !env.CLOUDINARY) return;
  const url = new URL(env.CLOUDINARY);
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password
  });
  configured = true;
}

export { cloudinary };
