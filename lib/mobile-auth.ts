import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import { AuthSessionModel } from "@/models/AuthSession";
import { UserModel } from "@/models/User";

export async function createMobileSession(userId: string) {
  await connectToDatabase();
  const token = crypto.randomBytes(32).toString("hex");
  await AuthSessionModel.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  });
  return token;
}

export async function getMobileUserFromRequest(request: Request) {
  await connectToDatabase();
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) throw new Error("UNAUTHORIZED");
  const session = (await AuthSessionModel.findOne({ token, expiresAt: { $gt: new Date() } }).lean()) as any;
  if (!session) throw new Error("UNAUTHORIZED");
  const user = (await UserModel.findById(session.userId).lean()) as any;
  if (!user) throw new Error("UNAUTHORIZED");
  return user as any;
}

export async function clearMobileSession(token: string) {
  await connectToDatabase();
  await AuthSessionModel.deleteOne({ token });
}
