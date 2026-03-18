import { connectToDatabase } from "@/lib/db";
import { normalizePhoneNumber } from "@/lib/phone";
import { SellerProfileModel } from "@/models/SellerProfile";
import { UserModel } from "@/models/User";

export async function findOrCreatePhoneUser(phoneInput: string, role: "seller" | "admin" = "seller") {
  await connectToDatabase();
  const phoneNumber = normalizePhoneNumber(phoneInput);
  let user = await UserModel.findOne({ phoneNumber });
  if (!user) {
    user = await UserModel.create({
      phoneNumber,
      role,
      isPhoneVerified: true,
      name: role === "admin" ? "Admin User" : "Seller"
    });
  } else if (!user.isPhoneVerified) {
    user.isPhoneVerified = true;
    await user.save();
  }
  if (user.role === "seller") {
    await SellerProfileModel.findOneAndUpdate(
      { userId: user._id },
      { userId: user._id, phone: phoneNumber, displayName: user.name ?? "Seller", languagePreference: "EN" },
      { upsert: true, new: true }
    );
  }
  return user;
}
