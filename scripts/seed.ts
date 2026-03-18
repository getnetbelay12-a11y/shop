import { connectToDatabase } from "@/lib/db";
import { AnalyticsEventModel } from "@/models/AnalyticsEvent";
import { AuthSessionModel } from "@/models/AuthSession";
import { ConversationModel } from "@/models/Conversation";
import { MessageModel } from "@/models/Message";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";
import { SellerProfileModel } from "@/models/SellerProfile";
import { StorefrontModel } from "@/models/Storefront";
import { UserModel } from "@/models/User";
import { VerificationCodeModel } from "@/models/VerificationCode";

async function seed() {
  await connectToDatabase();
  await Promise.all([
    AnalyticsEventModel.deleteMany({}),
    MessageModel.deleteMany({}),
    ConversationModel.deleteMany({}),
    OrderModel.deleteMany({}),
    ProductModel.deleteMany({}),
    AuthSessionModel.deleteMany({}),
    VerificationCodeModel.deleteMany({}),
    SellerProfileModel.deleteMany({}),
    StorefrontModel.deleteMany({}),
    UserModel.deleteMany({})
  ]);

  const [seller, admin] = await UserModel.create([
    { name: "Selam Style Studio", email: "seller@shop.local", phoneNumber: "+251911223344", role: "seller", isPhoneVerified: true },
    { name: "Admin User", email: "admin@shop.local", phoneNumber: "+251911000111", role: "admin", isPhoneVerified: true }
  ]);

  await SellerProfileModel.create({
    userId: seller._id,
    phone: "+251911223344",
    displayName: "Selam Style Studio",
    languagePreference: "EN"
  });

  const store = await StorefrontModel.create({
    sellerId: seller._id,
    storeName: "Selam Style Studio",
    slug: "demo-style",
    bio: "Curated women’s fashion for Addis shoppers buying through TikTok, Telegram, and Instagram. Fast replies, clear prices, and trusted order follow-up.",
    phone: "+251911223344",
    logo: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1400&q=80",
    language: "EN",
    status: "active"
  });

  const products = await ProductModel.insertMany([
    {
      sellerId: seller._id,
      storeId: store._id,
      title: "Addis Everyday White Sneakers",
      description: "Clean white sneakers with a cushioned insole and durable rubber base. Easy to pair with jeans, dresses, or everyday casual looks.",
      price: 3850,
      category: "Shoes",
      stock: 12,
      tags: ["sneakers", "white shoes", "casual", "daily wear"],
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"],
      attributes: { color: "white", size: "42" }
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      title: "Soft Strap Flat Sandals",
      description: "Comfortable flat sandals with soft straps for warm-weather styling and easy daily wear.",
      price: 2650,
      category: "Shoes",
      stock: 9,
      tags: ["sandals", "summer", "flat shoes"],
      images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"],
      attributes: { color: "tan", size: "39" }
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      title: "Relaxed Fit Black Hoodie",
      description: "Soft heavyweight hoodie with a relaxed fit and clean silhouette. Popular for cool evenings and campus wear.",
      price: 2950,
      category: "Tops",
      stock: 7,
      tags: ["hoodie", "black hoodie", "casual top"],
      images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"],
      attributes: { color: "black", size: "L" }
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      title: "High-Waist Wide Leg Jeans",
      description: "Structured denim with a flattering high waist and relaxed wide-leg finish for everyday styling.",
      price: 3450,
      category: "Bottoms",
      stock: 8,
      tags: ["jeans", "wide leg", "denim"],
      images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80"],
      attributes: { color: "blue", size: "32" }
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      title: "Ribbed Everyday T-Shirt",
      description: "Comfortable ribbed tee for layering, casual outfits, and reliable daily use.",
      price: 1450,
      category: "Tops",
      stock: 24,
      tags: ["t-shirt", "basic top", "ribbed"],
      images: ["https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=900&q=80"],
      attributes: { color: "olive", size: "M" }
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      title: "Structured Daily Tote",
      description: "Spacious tote bag with reinforced handles, made for classes, errands, and daily city use.",
      price: 2350,
      category: "Accessories",
      stock: 11,
      tags: ["tote bag", "daily bag", "accessories"],
      images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80"],
      attributes: { color: "beige" }
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      title: "Layered Silver Look Necklace",
      description: "Lightweight layered necklace that adds shine to both casual and dressed-up looks.",
      price: 1250,
      category: "Accessories",
      stock: 18,
      tags: ["necklace", "silver", "jewelry"],
      images: ["https://images.unsplash.com/photo-1617038260897-41a1f14a8ca5?auto=format&fit=crop&w=900&q=80"],
      attributes: { color: "silver" }
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      title: "Light Utility Overshirt Jacket",
      description: "A lightweight jacket-overshirt hybrid with front pockets and an easy relaxed fit.",
      price: 4650,
      category: "Outerwear",
      stock: 5,
      tags: ["jacket", "overshirt", "outerwear"],
      images: ["https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80"],
      attributes: { color: "khaki", size: "L" }
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      title: "Cream Linen Blend Shirt",
      description: "Breathable button-up shirt designed for warm days, polished casual wear, and light layering.",
      price: 2550,
      category: "Tops",
      stock: 10,
      tags: ["linen shirt", "lightweight top", "button-up"],
      images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80"],
      attributes: { color: "cream", size: "M" }
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      title: "City Classic Black Loafers",
      description: "Polished loafers with a soft cushioned sole, made for office wear and dressy casual outfits.",
      price: 4350,
      category: "Shoes",
      stock: 6,
      tags: ["loafers", "black shoes", "smart casual"],
      images: ["https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=80"],
      attributes: { color: "black", size: "40" }
    }
  ]);

  await OrderModel.insertMany([
    {
      sellerId: seller._id,
      storeId: store._id,
      productId: products[0]._id,
      name: "Meklit",
      phone: "+251900000001",
      telegram: "@meklit",
      city: "Addis Ababa",
      address: "Bole, near Edna Mall",
      quantity: 1,
      total: 3850,
      status: "new"
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      productId: products[2]._id,
      name: "Liya",
      phone: "+251900000002",
      city: "Bahir Dar",
      address: "Kebele 14",
      quantity: 2,
      total: 5900,
      status: "confirmed"
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      productId: products[5]._id,
      name: "Betelhem",
      phone: "+251900000003",
      telegram: "@bettyshopper",
      city: "Hawassa",
      address: "Piassa area",
      quantity: 1,
      total: 2350,
      status: "confirmed"
    },
    {
      sellerId: seller._id,
      storeId: store._id,
      productId: products[8]._id,
      name: "Rahel",
      phone: "+251900000004",
      city: "Addis Ababa",
      address: "CMC, Sunshine area",
      quantity: 1,
      total: 2550,
      status: "delivered"
    }
  ]);

  const conversations = await ConversationModel.insertMany([
    {
      storeId: store._id,
      sellerId: seller._id,
      visitorName: "TikTok shopper",
      language: "EN"
    },
    {
      storeId: store._id,
      sellerId: seller._id,
      visitorName: "Telegram buyer",
      language: "EN"
    },
    {
      storeId: store._id,
      sellerId: seller._id,
      visitorName: "Instagram DM lead",
      language: "EN"
    }
  ]);

  await MessageModel.insertMany([
    {
      conversationId: conversations[0]._id,
      role: "user",
      content: "I need stylish shoes under 4000 ETB. Which one moves fastest?"
    },
    {
      conversationId: conversations[0]._id,
      role: "assistant",
      content: "For under 4000 ETB, Addis Everyday White Sneakers at 3850 ETB are one of the strongest options, and Soft Strap Flat Sandals at 2650 ETB are the more affordable choice."
    },
    {
      conversationId: conversations[1]._id,
      role: "user",
      content: "Do you have a clean black hoodie for gifting in medium or large?"
    },
    {
      conversationId: conversations[1]._id,
      role: "assistant",
      content: "Yes. Relaxed Fit Black Hoodie is available in black and the seeded catalog currently shows size L with stock available."
    },
    {
      conversationId: conversations[2]._id,
      role: "user",
      content: "Which bag and necklace can I pair together for a simple look?"
    },
    {
      conversationId: conversations[2]._id,
      role: "assistant",
      content: "A simple combination is Structured Daily Tote at 2350 ETB with the Layered Silver Look Necklace at 1250 ETB. They work well together for a clean everyday outfit."
    }
  ]);

  const analyticsEvents = [
    ...Array.from({ length: 146 }).map(() => ({ sellerId: seller._id, storeId: store._id, type: "store_view" as const })),
    ...Array.from({ length: 61 }).map((_, index) => ({
      sellerId: seller._id,
      storeId: store._id,
      type: "product_view" as const,
      productId: products[index % products.length]._id
    })),
    ...[
      "shoes under 4000",
      "black hoodie",
      "tote bag",
      "white sneakers",
      "gift ideas",
      "linen shirt",
      "loafers",
      "summer sandals",
      "daily accessories",
      "casual tops"
    ].flatMap((q) =>
      Array.from({ length: 3 }).map(() => ({
        sellerId: seller._id,
        storeId: store._id,
        type: "search" as const,
        meta: { q }
      }))
    ),
    ...Array.from({ length: 18 }).map(() => ({ sellerId: seller._id, storeId: store._id, type: "ai_chat" as const })),
    ...[
      { productId: products[0]._id, total: 3850 },
      { productId: products[2]._id, total: 5900 },
      { productId: products[5]._id, total: 2350 },
      { productId: products[8]._id, total: 2550 }
    ].map((order) => ({
      sellerId: seller._id,
      storeId: store._id,
      type: "order" as const,
      productId: order.productId,
      meta: { total: order.total }
    }))
  ];

  await AnalyticsEventModel.insertMany(analyticsEvents);

  console.log("Seeded Shop MVP");
  console.log("Seller phone login: +251911223344");
  console.log("Admin phone login: +251911000111");
  console.log("Dev OTP: 123456");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
