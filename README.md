# CareerMatch Pro

Full-stack AI-powered career matching platform built with Next.js 14, Prisma, Supabase, and Stripe.

## Features

- **AI-Powered Job Matching** — Smart algorithm matches candidates with relevant jobs
- **Dual Role System** — Job seekers and employers with separate dashboards
- **Real Database** — All data persisted in PostgreSQL via Prisma + Supabase
- **Authentication** — Secure auth via Supabase Auth with middleware protection
- **Payments** — Stripe integration for Pro/Enterprise subscriptions
- **Messaging** — Direct messaging between candidates and employers
- **Notifications** — Real-time notification system
- **Responsive Design** — Mobile-first with Tailwind CSS + shadcn/ui

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Components, Server Actions)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Supabase Auth (OAuth + Email/Password)
- **Payments:** Stripe (Checkout + Webhooks)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Deployment:** Vercel-ready

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and Stripe credentials

# 3. Initialize database
npx prisma generate
npx prisma db push

# 4. Run development server
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Configure Stripe webhook endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
5. Deploy!

## Monetization

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 3 applications/month, basic profile |
| Pro | $19/mo | Unlimited applications, AI matching, priority, messages |
| Enterprise | $99/mo | Unlimited jobs, AI screening, API access, dedicated manager |

## License

MIT
