import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { recordAnalytics } from "@/lib/data";
import { storeAssistant } from "@/lib/ai";
import { ConversationModel } from "@/models/Conversation";
import { MessageModel } from "@/models/Message";
import { ProductModel } from "@/models/Product";
import { StorefrontModel } from "@/models/Storefront";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { message, conversationId } = await request.json();
  await connectToDatabase();
  const store = (await StorefrontModel.findOne({ slug }).lean()) as {
    _id: string;
    sellerId: string;
    storeName: string;
    language: "EN" | "AM";
  } | null;
  if (!store) return NextResponse.json({ error: "Store not found." }, { status: 404 });
  const products = (await ProductModel.find({ storeId: store._id }).lean()) as unknown as Array<{
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    tags?: string[];
    stock: number;
  }>;
  const result = await storeAssistant(message, store.storeName, products.map((product) => ({
    _id: String(product._id),
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    tags: product.tags ?? [],
    stock: product.stock
  })));
  const conversation =
    conversationId
      ? await ConversationModel.findOneAndUpdate(
          { _id: conversationId, storeId: store._id },
          { $set: { updatedAt: new Date() } },
          { new: true }
        )
      : await ConversationModel.create({
          storeId: store._id,
          sellerId: store.sellerId,
          language: store.language
        });
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }
  await MessageModel.insertMany([
    { conversationId: conversation._id, role: "user", content: message },
    { conversationId: conversation._id, role: "assistant", content: result.answer }
  ]);
  await recordAnalytics({ type: "ai_chat", storeId: String(store._id), sellerId: String(store.sellerId), meta: { message } });
  return NextResponse.json({ ...result, conversationId: String(conversation._id) });
}
