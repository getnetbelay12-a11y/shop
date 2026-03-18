import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, MessageSquareMore, ShoppingBag, Store } from "lucide-react";
import { Shell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  { title: "Launch your own shop link", description: "Set up a seller-owned storefront you can share on TikTok bio, Telegram, or Instagram story.", icon: Store },
  { title: "Add products in minutes", description: "Upload real products, set ETB prices, and let AI sharpen descriptions for social buyers.", icon: ShoppingBag },
  { title: "Close buyers faster with AI", description: "Customers can ask questions, compare options, and place orders without leaving your link.", icon: Bot }
];

const proof = [
  "Built for Ethiopian sellers pricing in ETB",
  "Works well for TikTok, Telegram, and Instagram traffic",
  "AI only answers from your store catalog"
];

export default async function HomePage() {
  return (
    <Shell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-7">
            <p className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">Seller-first storefronts for Ethiopian social commerce</p>
            <h1 className="max-w-3xl text-5xl font-bold tracking-[-0.04em] sm:text-6xl">Turn social traffic into real ETB orders with a storefront that sells for you.</h1>
            <p className="max-w-2xl text-lg text-stone-600">
              Shop helps sellers share one clean shop link, show trusted prices, answer buyer questions with AI, and collect orders from TikTok, Telegram, and Instagram followers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup"><Button className="px-6">Create your seller shop</Button></Link>
              <Link href="/shop/demo-style"><Button variant="outline" className="px-6">View live seller demo</Button></Link>
            </div>
            <div className="grid gap-3">
              {proof.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-stone-700">
                  <CheckCircle2 className="size-4 text-[var(--primary)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
              <Card className="p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Setup</p>
                <p className="mt-2 text-2xl font-bold">10 min</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Buyer channels</p>
                <p className="mt-2 text-2xl font-bold">TikTok, IG, TG</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Checkout style</p>
                <p className="mt-2 text-2xl font-bold">Fast order capture</p>
              </Card>
            </div>
          </div>
          <Card className="overflow-hidden p-2">
            <div className="rounded-[24px] bg-[linear-gradient(160deg,rgba(15,118,110,0.08),rgba(221,141,39,0.08),rgba(255,255,255,0.96))] p-5 sm:p-6">
              <div className="rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Selam Style Studio</p>
                    <p className="text-xs text-stone-500">Live seller demo storefront</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live</div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-stone-50/90 p-4">
                    <MessageSquareMore className="mb-3 size-5 text-[var(--primary)]" />
                    <p className="text-sm font-semibold">AI handles buyer questions</p>
                    <p className="mt-2 text-sm text-stone-600">“Do you have shoes under 4,000 ETB?” gets an instant grounded answer.</p>
                  </div>
                  <div className="rounded-3xl bg-stone-50/90 p-4">
                    <ShoppingBag className="mb-3 size-5 text-[var(--secondary)]" />
                    <p className="text-sm font-semibold">Orders land in the seller dashboard</p>
                    <p className="mt-2 text-sm text-stone-600">Track views, chats, product interest, and incoming orders in one place.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.title} className="rounded-3xl bg-stone-50/90 p-5">
                        <Icon className="mb-3 size-6 text-[var(--primary)]" />
                        <h2 className="text-lg font-semibold">{step.title}</h2>
                        <p className="mt-2 text-sm text-stone-600">{step.description}</p>
                      </div>
                    );
                  })}
                </div>
                <Link href="/shop/demo-style" className="mt-5 block">
                  <Button variant="secondary" className="w-full">
                    Open seller demo
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500">For fashion sellers</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">Sell from the platforms where your customers already message you.</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">Instead of sending price lists and photos one by one, send one shop link that looks professional and closes faster.</p>
          </Card>
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500">For trust</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">Show clear ETB pricing, simple order forms, and faster buyer replies.</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">Buyers see a real storefront, not a scattered set of screenshots and captions.</p>
          </Card>
          <Card className="p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500">For growth</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">Know what products people search, ask about, and order most.</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">Use the dashboard to learn what converts and restock with better confidence.</p>
          </Card>
        </section>
      </main>
    </Shell>
  );
}
