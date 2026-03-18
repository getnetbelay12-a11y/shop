import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { consumeOtp } from "@/lib/otp";
import { findOrCreatePhoneUser } from "@/lib/user-auth";
import { normalizePhoneNumber } from "@/lib/phone";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone number", type: "text" },
        otpCode: { label: "OTP code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.phoneNumber || !credentials.otpCode) return null;
        await connectToDatabase();
        await consumeOtp(credentials.phoneNumber, credentials.otpCode, "seller_login");
        const phoneNumber = normalizePhoneNumber(credentials.phoneNumber);
        const existing = (await UserModel.findOne({ phoneNumber }).lean()) as any;
        const user = existing?.role === "admin"
          ? existing
          : await findOrCreatePhoneUser(phoneNumber, "seller");
        return {
          id: String(user._id),
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber
        } as never;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.phoneNumber = (user as { phoneNumber?: string }).phoneNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = String(token.role ?? "seller");
        session.user.phoneNumber = String(token.phoneNumber ?? "");
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};
