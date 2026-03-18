import OpenAI from "openai";
import { env } from "@/lib/env";

type ProductRecord = {
  _id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  tags: string[];
  stock?: number;
};

const QUERY_SYNONYMS: Record<string, string[]> = {
  shoes: ["shoe", "sneaker", "sneakers", "sandals", "loafer", "loafers"],
  tops: ["top", "shirt", "tee", "hoodie", "linen"],
  accessories: ["bag", "tote", "necklace", "accessory"],
  ጫማ: ["shoes", "shoe", "sneakers", "sandals", "loafer"],
  ርካሽ: ["cheap", "budget", "affordable"]
};

function extractTerms(message: string) {
  const terms = message.toLowerCase().split(/[^a-z0-9ሀ-፿]+/).filter(Boolean);
  const expanded = new Set(terms);
  for (const term of terms) {
    for (const synonym of QUERY_SYNONYMS[term] ?? []) expanded.add(synonym);
  }
  return Array.from(expanded);
}

function localRewrite(text: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean
    ? `Designed for social shoppers, ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`
    : "";
}

function localTags(text: string) {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 3)
        .slice(0, 8)
    )
  );
}

function localBilingual(title: string, description: string) {
  return {
    titleEn: title,
    descriptionEn: description,
    titleAm: `የ${title} ምርት`,
    descriptionAm: `${title} በቀላሉ ለመግዛት የቀረበ ምርት ነው። ${description}`
  };
}

function ruleBasedAssistant(message: string, storeName: string, products: ProductRecord[]) {
  const query = message.toLowerCase();
  const isAmharic = /[ሀ-፿]/.test(message);
  const priceCapMatch = query.match(/(\d{3,6})/);
  const cheaperIntent = /cheap|cheaper|budget|low|affordable|ቀላል ዋጋ|ርካሽ/i.test(query);
  const underPrice = priceCapMatch ? Number(priceCapMatch[1]) : null;
  const normalizedTerms = extractTerms(query);
  const wantsAvailability = /size|color|stock|available|have|in stock|አለ|መጠን|ቀለም|አለን/i.test(query);
  const wantsCheapestRelevant = cheaperIntent || underPrice !== null;

  const ranked = products
    .map((product) => {
      let score = 0;
      const title = product.title.toLowerCase();
      const description = product.description.toLowerCase();
      const category = product.category.toLowerCase();
      const tags = product.tags.map((tag) => tag.toLowerCase());
      for (const term of normalizedTerms) {
        if (title.includes(term)) score += 12;
        if (category.includes(term)) score += 8;
        if (tags.some((tag) => tag.includes(term))) score += 10;
        if (description.includes(term)) score += 4;
      }
      if (underPrice !== null && product.price <= underPrice) score += 20;
      if (cheaperIntent) score += Math.max(0, 30 - product.price / 200);
      if (wantsAvailability && product.stock) score += 2;
      return { ...product, score };
    })
    .filter((product) => product.score > 0 || !normalizedTerms.length || wantsCheapestRelevant)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.price - b.price;
    });

  const relevantPool = normalizedTerms.length ? ranked.filter((product) => product.score >= 8) : ranked;
  const picks = (relevantPool.length ? relevantPool : ranked).slice(0, 3);
  const details = picks.map((product) => {
    const availability = typeof product.stock === "number" ? `, stock ${product.stock}` : "";
    return `${product.title} (${product.price} ETB${availability})`;
  });
  const answer = picks.length
    ? isAmharic
      ? `${storeName} ውስጥ የሚመጡ አማራጮች: ${details.join(", ")}. ሁሉም መረጃ ከአሁኑ ካታሎግ ብቻ ነው።`
      : `Here are the best matches from ${storeName}: ${details.join(", ")}. I’m only using the current store catalog.`
    : isAmharic
      ? `በ${storeName} ውስጥ ከጥያቄዎ ጋር የሚስማማ ምርት አላገኘሁም።`
      : `I could not find a matching item in ${storeName} from the current catalog.`;
  return {
    answer,
    suggestedProducts: picks.map((product) => String(product._id ?? product.title))
  };
}

async function callOpenAI(prompt: string) {
  if (!env.OPENAI_API_KEY) return null;
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: prompt
  });
  return response.output_text;
}

export async function rewriteDescription(description: string) {
  const prompt = `Rewrite this product description to be concise, persuasive, and factual. Only use the input text.\n${description}`;
  const output = await callOpenAI(prompt);
  return output?.trim() || localRewrite(description);
}

export async function generateBilingualContent(title: string, description: string) {
  const prompt = `Return JSON with titleEn, descriptionEn, titleAm, descriptionAm. Keep all claims grounded in the source text.\nTitle: ${title}\nDescription: ${description}`;
  const output = await callOpenAI(prompt);
  if (output) {
    try {
      return JSON.parse(output) as {
        titleEn: string;
        descriptionEn: string;
        titleAm: string;
        descriptionAm: string;
      };
    } catch {
      return localBilingual(title, description);
    }
  }
  return localBilingual(title, description);
}

export async function suggestTags(description: string) {
  const prompt = `Return a JSON array of up to 8 lowercase tags based only on this description:\n${description}`;
  const output = await callOpenAI(prompt);
  if (output) {
    try {
      return JSON.parse(output) as string[];
    } catch {
      return localTags(description);
    }
  }
  return localTags(description);
}

export async function storeAssistant(message: string, storeName: string, products: ProductRecord[]) {
  const catalog = products.map((product) => ({
    id: product._id,
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    tags: product.tags,
    stock: product.stock
  }));
  const prompt = [
    "You are a shopping assistant.",
    "Rules: answer only from provided store/product data. If the data does not support a claim, say you do not know.",
    "Support English and simple Amharic.",
    "Prefer recommending the most relevant products in the same category the user is asking about.",
    "Mention price and stock when helpful. Never invent delivery, material, or sizing details not in the catalog.",
    `Store: ${storeName}`,
    `Catalog JSON: ${JSON.stringify(catalog)}`,
    `User message: ${message}`,
    "Return JSON with answer and suggestedProducts (array of product ids)."
  ].join("\n");

  const output = await callOpenAI(prompt);
  if (output) {
    try {
      return JSON.parse(output) as { answer: string; suggestedProducts: string[] };
    } catch {
      return ruleBasedAssistant(message, storeName, products);
    }
  }
  return ruleBasedAssistant(message, storeName, products);
}
