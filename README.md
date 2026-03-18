# Shop

Seller-first AI-powered social commerce platform built with Next.js 15, TypeScript, Expo React Native, Mongoose, phone-number OTP auth, OpenAI-ready AI tools, Cloudinary-ready uploads, and Redis/BullMQ-ready analytics jobs.

## Setup

1. Install dependencies:
   `npm install`
2. Copy env file:
   `cp .env.example .env.local`
3. Set:
   `MONGO_URI`, `NEXTAUTH_SECRET`, `OTP_PROVIDER`, `OTP_DEV_DEFAULT_CODE`, `OPENAI_API_KEY` (optional), `REDIS_URL` (optional), `CLOUDINARY` (optional)
4. Seed demo data:
   `npm run seed`
5. Start the app:
   `npm run dev`

## Web and mobile

- Web:
  `npm run dev`
- Mobile Expo:
  `cd apps/mobile && npx expo start`
- Native iPhone Simulator:
  `cd apps/mobile && npx expo run:ios --device "iPhone 17 Pro"`

## Custom domain

Production domain is configured in the app as:
- `https://shegahomes.com`

For deployment:
1. Point `shegahomes.com` and `www.shegahomes.com` to your hosting provider
2. Set production env vars:
   `APP_URL=https://shegahomes.com`
   `NEXTAUTH_URL=https://shegahomes.com`
   `EXPO_PUBLIC_API_BASE_URL=https://shegahomes.com`
3. Redeploy the web app after DNS and env vars are updated

Notes:
- Local development should still use `http://localhost:3000`
- The codebase metadata and canonical URL handling now support `shegahomes.com`

## Demo login

- Seller phone: `+251911223344`
- Admin phone: `+251911000111`
- Dev OTP: `123456`

## Core routes

- `/` marketing home
- `/discover` storefront directory
- `/login` login
- `/dashboard` seller dashboard
- `/admin` admin panel
- `/shop/demo-style` demo storefront
- `/api/health` service health JSON

## Notes

- Seller login is phone-number-first with OTP.
- In dev mode, `OTP_PROVIDER=dev` returns the test code and stores it locally for easy demos.
- AI actions use OpenAI when `OPENAI_API_KEY` is set. Without it, the app falls back to deterministic grounded logic using store data only.
- Analytics are queued through BullMQ when `REDIS_URL` is configured. Without Redis, events are saved directly to MongoDB.
- Cloudinary is wired for future signed uploads; current MVP accepts image URLs directly for reliable setup speed.
- The seller dashboard, admin console, and mobile settings screen now surface live service status so you can see what is production-ready versus fallback.
