# Verdant — Olive Essence Hair Oil (E-Commerce v1)

A standalone, single-product premium e-commerce storefront built with
Next.js App Router, TypeScript, Tailwind CSS, Prisma + Neon Postgres,
Cloudinary, and a Paymob integration point (with Cash on Delivery
fallback). Designed as a fast, focused Landing → Product → Cart →
Checkout → Order flow for one hero product, structured so more products
can be added later without a rewrite.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — olive / cream / ink editorial design system
- **Prisma** + **Neon Postgres**
- **Cloudinary** for product image uploads
- **Paymob** for online payment (optional — Cash on Delivery works out of the box)
- Simple environment-based admin password (no external auth provider)

## Project Structure

```
src/
  app/
    page.tsx                 Homepage
    product/page.tsx         Product detail page
    cart/page.tsx             Full cart page
    checkout/page.tsx         Checkout
    checkout/success/page.tsx Order confirmation
    admin/                    Admin login, dashboard, orders, product editor
    api/                      Route handlers (orders, products, admin, upload, paymob)
  components/
    layout/                  Header, Footer, CartDrawer
    home/                    Homepage sections
    product/                 Product page pieces
    checkout/                Checkout form
    admin/                   Admin UI
    ui/                      Shared small components
  lib/                       Prisma client, cart context, Paymob/Cloudinary
                              integration points, types, utils
prisma/
  schema.prisma              Product / Order / OrderItem models
  seed.ts                    Seeds the single launch product
```

## 1. Install

```bash
npm install
```

## 2. Configure environment variables

Copy the example file and fill in real values (never commit `.env`):

```bash
cp .env.example .env
```

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Neon pooled connection string |
| `DIRECT_URL` | Recommended | Neon direct (non-pooled) connection string, used by Prisma migrations |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | For image uploads | From your Cloudinary dashboard |
| `PAYMOB_PUBLIC_KEY` / `PAYMOB_SECRET_KEY` / `PAYMOB_INTEGRATION_ID` / `PAYMOB_HMAC_SECRET` | Optional | Intention API (Unified Checkout). Leave blank to run Cash on Delivery only — checkout automatically hides online payment when unset |
| `ADMIN_PASSWORD` | Yes | Plain password for `/admin` sign-in |

### Configuring Neon

1. Create a new project at [neon.tech](https://neon.tech) — use a **new, isolated** project for this app (don't reuse another project's database).
2. Copy the pooled connection string into `DATABASE_URL`.
3. Copy the direct connection string into `DIRECT_URL`.
4. Push the schema and seed the launch product:

   ```bash
   npm run db:push
   npm run db:seed
   ```

   (If you skip seeding, the storefront and checkout still work — the first order placed will automatically create the product record from built-in fallback content.)

### Configuring Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the dashboard, copy your Cloud Name, API Key, and API Secret into the matching env vars.
3. Uploads happen from the admin Product page (`/admin/product`) — until these are set, the upload button will return a clear "not configured" error instead of a broken UI.

### Configuring Paymob

Uses the **Intention API** (Unified Checkout redirection):

1. Create a Paymob merchant account and an online-card integration.
2. From Dashboard → Settings → API Keys, fill in `PAYMOB_PUBLIC_KEY`, `PAYMOB_SECRET_KEY`, and `PAYMOB_HMAC_SECRET`.
3. Set `PAYMOB_INTEGRATION_ID` from the online card integration.
4. Point Paymob's transaction callback at `https://<your-domain>/api/paymob/callback` (also sent per-intention as `notification_url`).
5. Until these are configured, checkout only shows Cash on Delivery — the "Pay Online" option is hidden automatically, so customers never see a broken payment UI.

## 3. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 4. Access the admin panel

Go to `http://localhost:3000/admin` and sign in with the password set in
`ADMIN_PASSWORD`. From there you can:

- **Overview** — order counts and revenue at a glance
- **Orders** — view customer details, items, and update order status (Pending → Confirmed → Shipped → Delivered)
- **Product** — edit name, description, price, ingredients, benefits, usage instructions, and upload/remove product images

## 5. Deploy to Vercel

1. Push this repository to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.example` in the Vercel project settings (Production + Preview).
4. Deploy. Vercel will run `prisma generate` automatically via the `postinstall` script; run `npm run db:push` (and optionally `npm run db:seed`) once against your Neon database, either locally with `DATABASE_URL` pointed at Neon, or via a one-off Vercel deploy hook.
5. Update the Paymob callback URL to your production domain once deployed.

## Notes on architecture / extensibility

- The product catalog is a real `Product` table (not hardcoded), so adding
  a second product later mainly means: updating the homepage/product page
  to list multiple products, and extending the cart/checkout to reference
  more than one product per order (the `OrderItem` model already supports
  this).
- The cart is intentionally client-side (localStorage) for speed and
  simplicity in v1 — no accounts required to buy.
- Admin auth is a single shared password by design, per the v1 requirements — swap in a real auth provider later if multiple admin users are needed.
