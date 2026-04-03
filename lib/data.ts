import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { AnalyticsEventModel } from "@/models/AnalyticsEvent";
import { ConversationModel } from "@/models/Conversation";
import { MessageModel } from "@/models/Message";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";
import { ProductRequestModel } from "@/models/ProductRequest";
import { SellerProfileModel } from "@/models/SellerProfile";
import { StorefrontModel } from "@/models/Storefront";
import { UserModel } from "@/models/User";
import { InterestLeadModel } from "@/models/InterestLead";
import { getAnalyticsQueue } from "@/lib/redis";

const SEARCH_SYNONYMS: Record<string, string[]> = {
  shoes: ["shoe", "sneaker", "sneakers", "sandals", "loafer", "loafers", "footwear"],
  sneaker: ["sneakers", "shoe", "shoes", "canvas"],
  jacket: ["outerwear", "coat"],
  top: ["tops", "tee", "shirt", "hoodie"],
  bag: ["tote", "accessory", "accessories"],
  cheap: ["budget", "affordable", "cheaper", "low"],
  ርካሽ: ["cheap", "affordable", "budget"],
  ጫማ: ["shoes", "shoe", "sneakers", "sandals", "loafers"],
  ሸሚዝ: ["shirt", "tops", "tee"],
  ጃኬት: ["jacket", "outerwear"]
};

function expandTerms(query: string) {
  const base = query
    .toLowerCase()
    .split(/[^a-z0-9ሀ-፿]+/)
    .filter(Boolean);
  const expanded = new Set(base);
  for (const term of base) {
    for (const synonym of SEARCH_SYNONYMS[term] ?? []) expanded.add(synonym);
  }
  return Array.from(expanded);
}

export async function getStoreBySlug(slug: string): Promise<any | null> {
  await connectToDatabase();
  return (await StorefrontModel.findOne({ slug }).lean()) as any;
}

export async function getSellerStore(userId: string): Promise<any | null> {
  await connectToDatabase();
  return (await StorefrontModel.findOne({ sellerId: userId }).lean()) as any;
}

function scoreProduct(product: {
  title: string;
  description: string;
  category: string;
  tags: string[];
}, query: string) {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return 0;
  const terms = expandTerms(normalized);
  let score = 0;
  const title = product.title.toLowerCase().replace(/-/g, " ");
  const description = product.description.toLowerCase();
  const category = product.category.toLowerCase();
  const tags = (product.tags ?? []).map((tag) => tag.toLowerCase());

  for (const term of terms) {
    if (title === term) score += 140;
    else if (title.includes(term)) score += 100;

    if (tags.some((tag) => tag === term)) score += 85;
    else if (tags.some((tag) => tag.includes(term))) score += 60;

    if (category === term) score += 55;
    else if (category.includes(term)) score += 40;

    if (description.includes(term)) score += 20;
  }

  if (terms.length > 1 && title.includes(normalized)) score += 80;
  if (terms.length > 1 && tags.some((tag) => tag.includes(normalized))) score += 45;
  if (title.startsWith(terms[0] ?? "")) score += 15;

  return score;
}

export async function searchStoreProducts(slug: string, query: string, category?: string) {
  await connectToDatabase();
  const store = (await StorefrontModel.findOne({ slug }).lean()) as any;
  if (!store) return [];
  const products = (await ProductModel.find({
    storeId: store._id,
    ...(category ? { category } : {})
  }).lean()) as any[];
  return products
    .map((product) => ({
      ...product,
      searchScore: scoreProduct(
        {
          title: product.title,
          description: product.description,
          category: product.category,
          tags: product.tags ?? []
        },
        query
      )
    }))
    .filter((product) => (query ? product.searchScore > 0 : true))
    .sort((a, b) => {
      if (b.searchScore !== a.searchScore) return b.searchScore - a.searchScore;
      return new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime();
    });
}

export async function getProductById(storeSlug: string, productId: string): Promise<any | null> {
  await connectToDatabase();
  const store = (await StorefrontModel.findOne({ slug: storeSlug }).lean()) as any;
  if (!store) return null;
  return (await ProductModel.findOne({ _id: productId, storeId: store._id }).lean()) as any;
}

export async function getGlobalProductById(productId: string): Promise<any | null> {
  await connectToDatabase();
  const product = await ProductModel.findById(productId).lean() as any;
  if (!product) return null;
  const store = await StorefrontModel.findById(product.storeId).lean() as any;
  if (!store || store.status !== "active") return null;
  return {
    ...product,
    storeSlug: store.slug,
    storeName: store.storeName,
    storePhone: store.phone
  };
}

export async function getMarketplaceProducts(input: {
  query?: string;
  category?: string;
  sort?: string;
  limit?: number;
}) {
  await connectToDatabase();
  const stores = await StorefrontModel.find({ status: "active" }).select("_id slug storeName phone").lean() as any[];
  const storeMap = new Map(stores.map((store) => [String(store._id), store]));
  const products = await ProductModel.find({
    storeId: { $in: stores.map((store) => store._id) },
    ...(input.category ? { category: input.category } : {})
  }).lean() as any[];

  const enriched = products
    .map((product) => {
      const store = storeMap.get(String(product.storeId));
      if (!store) return null;
      return {
        ...product,
        storeSlug: store.slug,
        storeName: store.storeName,
        storePhone: store.phone,
        searchScore: scoreProduct(
          {
            title: product.title,
            description: product.description,
            category: product.category,
            tags: product.tags ?? []
          },
          input.query ?? ""
        )
      };
    })
    .filter(Boolean) as any[];

  const filtered = enriched.filter((product) => (input.query ? product.searchScore > 0 : true));
  const sort = input.sort ?? "newest";
  filtered.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (input.query && b.searchScore !== a.searchScore) return b.searchScore - a.searchScore;
    return new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime();
  });

  return filtered.slice(0, input.limit ?? 24);
}

export async function getMarketplaceCategories() {
  await connectToDatabase();
  const stores = await StorefrontModel.find({ status: "active" }).select("_id").lean() as any[];
  return ProductModel.distinct("category", { storeId: { $in: stores.map((store) => store._id) } });
}

export async function getSimilarProducts(productId: string, limit = 4): Promise<any[]> {
  await connectToDatabase();
  const product = (await ProductModel.findById(productId).lean()) as any;
  if (!product) return [];
  const candidates = (await ProductModel.find({
    storeId: product.storeId,
    _id: { $ne: product._id }
  }).lean()) as any[];
  return candidates
    .map((item) => {
      let score = 0;
      if (item.category === product.category) score += 40;
      const overlap = (item.tags ?? []).filter((tag) => (product.tags ?? []).includes(tag)).length;
      score += overlap * 12;
      const priceDelta = Math.abs(item.price - product.price);
      if (priceDelta <= product.price * 0.2) score += 20;
      else if (priceDelta <= product.price * 0.35) score += 10;
      const productAttrs = Object.fromEntries(Object.entries(product.attributes ?? {}));
      const itemAttrs = Object.fromEntries(Object.entries(item.attributes ?? {}));
      for (const [key, value] of Object.entries(productAttrs)) {
        if (String(itemAttrs[key] ?? "").toLowerCase() === String(value).toLowerCase()) score += 8;
      }
      return { ...item, similarityScore: score };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

export async function recordAnalytics(input: {
  type: "store_view" | "product_view" | "search" | "ai_chat" | "order";
  storeId?: string;
  sellerId?: string;
  productId?: string;
  meta?: Record<string, unknown>;
}) {
  const queue = getAnalyticsQueue();
  if (queue) {
    await queue.add("track", input);
    return;
  }
  await connectToDatabase();
  await AnalyticsEventModel.create({
    ...input,
    storeId: input.storeId ? new Types.ObjectId(input.storeId) : undefined,
    sellerId: input.sellerId ? new Types.ObjectId(input.sellerId) : undefined,
    productId: input.productId ? new Types.ObjectId(input.productId) : undefined
  });
}

export async function getDashboardMetrics(userId: string) {
  await connectToDatabase();
  const store = (await StorefrontModel.findOne({ sellerId: userId }).lean()) as any;
  if (!store) return null;
  const [products, orders, requests, lowStock, events, conversations] = await Promise.all([
    ProductModel.countDocuments({ sellerId: userId }),
    OrderModel.countDocuments({ sellerId: userId }),
    ProductRequestModel.countDocuments({ sellerId: userId, status: "new" }),
    ProductModel.countDocuments({ sellerId: userId, stock: { $lte: 3 } }),
    AnalyticsEventModel.countDocuments({ sellerId: userId, type: "store_view" }),
    ConversationModel.countDocuments({ sellerId: userId })
  ]);
  return { store, products, orders, requests, lowStock, visits: events, conversations };
}

export async function getSellerOrders(userId: string): Promise<any[]> {
  await connectToDatabase();
  return (await OrderModel.find({ sellerId: userId }).sort({ createdAt: -1 }).populate("productId").lean()) as any[];
}

export async function getSellerRequests(userId: string): Promise<any[]> {
  await connectToDatabase();
  return (await ProductRequestModel.find({ sellerId: userId })
    .sort({ createdAt: -1 })
    .populate("productId")
    .populate("storefrontId")
    .lean()) as any[];
}

export async function getSellerProducts(userId: string): Promise<any[]> {
  await connectToDatabase();
  return (await ProductModel.find({ sellerId: userId }).sort({ createdAt: -1 }).lean()) as any[];
}

export async function getSellerConversations(userId: string): Promise<any[]> {
  await connectToDatabase();
  const conversations = (await ConversationModel.find({ sellerId: userId }).sort({ updatedAt: -1 }).lean()) as any[];
  const ids = conversations.map((conversation) => conversation._id);
  const messages = (await MessageModel.find({ conversationId: { $in: ids } }).sort({ createdAt: 1 }).lean()) as any[];
  return conversations.map((conversation) => ({
    ...conversation,
    messages: messages.filter((message) => String(message.conversationId) === String(conversation._id))
  }));
}

export async function getSellerConversationById(userId: string, conversationId: string): Promise<any | null> {
  await connectToDatabase();
  const conversation = (await ConversationModel.findOne({ _id: conversationId, sellerId: userId }).lean()) as any;
  if (!conversation) return null;
  const messages = (await MessageModel.find({ conversationId }).sort({ createdAt: 1 }).lean()) as any[];
  return {
    ...conversation,
    messages
  };
}

export async function addSellerConversationMessage(userId: string, conversationId: string, content: string) {
  await connectToDatabase();
  const conversation = await ConversationModel.findOne({ _id: conversationId, sellerId: userId });
  if (!conversation) {
    throw new Error("Conversation not found.");
  }
  const message = await MessageModel.create({
    conversationId: conversation._id,
    role: "seller",
    content: content.trim()
  });
  conversation.updatedAt = new Date();
  await conversation.save();
  return message.toObject();
}

export async function getStoreConversationById(storeSlug: string, conversationId: string): Promise<any | null> {
  await connectToDatabase();
  const store = (await StorefrontModel.findOne({ slug: storeSlug }).lean()) as any;
  if (!store) return null;
  const conversation = (await ConversationModel.findOne({ _id: conversationId, storeId: store._id }).lean()) as any;
  if (!conversation) return null;
  const messages = (await MessageModel.find({ conversationId }).sort({ createdAt: 1 }).lean()) as any[];
  return {
    ...conversation,
    messages
  };
}

export async function getSellerAnalytics(userId: string): Promise<any> {
  await connectToDatabase();
  const [events, orders] = await Promise.all([
    AnalyticsEventModel.find({ sellerId: userId }).sort({ createdAt: -1 }).lean(),
    OrderModel.find({ sellerId: userId }).lean()
  ]);
  const grouped = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.type] = (acc[event.type] ?? 0) + 1;
    return acc;
  }, {});
  return {
    grouped,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
    recentEvents: events.slice(0, 12)
  };
}

export async function getAdminData(): Promise<any> {
  await connectToDatabase();
  const [sellers, stores, products, orders, requests, leads] = await Promise.all([
    UserModel.find({ role: "seller" }).lean(),
    StorefrontModel.find().lean(),
    ProductModel.find().lean(),
    OrderModel.find().lean(),
    ProductRequestModel.find().sort({ createdAt: -1 }).populate("productId").populate("storefrontId").lean(),
    InterestLeadModel.find().sort({ createdAt: -1 }).limit(20).lean()
  ]);
  return { sellers: sellers as any[], stores: stores as any[], products: products as any[], orders: orders as any[], requests: requests as any[], leads: leads as any[] };
}

export async function createSellerSetup(userId: string, input: {
  storeName: string;
  slug: string;
  bio: string;
  phone: string;
  logo?: string;
  banner?: string;
  language: "EN" | "AM";
}) {
  await connectToDatabase();
  const existingSlug = await StorefrontModel.findOne({ slug: input.slug, sellerId: { $ne: userId } }).lean();
  if (existingSlug) {
    throw new Error("That store slug is already taken.");
  }
  await SellerProfileModel.findOneAndUpdate(
    { userId },
    { userId, phone: input.phone, displayName: input.storeName, languagePreference: input.language },
    { upsert: true }
  );
  await UserModel.findByIdAndUpdate(userId, { phoneNumber: input.phone, isPhoneVerified: true, name: input.storeName });
  return StorefrontModel.findOneAndUpdate(
    { sellerId: userId },
    { sellerId: userId, ...input },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
