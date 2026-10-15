# LaunchPilot AI

LaunchPilot AI helps digital creators validate ideas, blueprint products, draft sales assets, organize launches, and keep manual competitor research in one workspace.

## Implemented in this repository

- Responsive marketing pages, pricing, FAQ, editable legal templates, and contact form.
- Email/password registration and login with bcrypt password hashes and database-backed, opaque sessions with HMAC-SHA-256 hashes stored in the database and tokens held in HttpOnly cookies.
- Protected dashboard pages and server-validated API routes.
- Groq-powered Idea Validator, Product Blueprint, Sales Page Generator, Pricing Assistant, and Marketing Kit.
- Free usage policy (3 successful generations lifetime) and Pro policy (100 successful generations per billing period); failed calls do not consume quota and request idempotency keys prevent duplicate counts.
- Projects and generated output persistence; launch task CRUD; manual competitor tracker CRUD.
- Whop checkout CTA using the exact supplied checkout URL, membership refresh structure, official Whop SDK webhook signature verification, idempotent webhook event storage, and server-side plan checks.
- Vitest unit tests for quota policy, authorization helpers, webhook verification, checkout URL, and subscription state.

## Prerequisites

- Node.js 20.9 or later (Node 22 LTS recommended)
- npm
- PostgreSQL / Neon project
- Groq API key
- Whop API key, product/plan IDs, and webhook secret before enabling live Pro memberships

## Local setup

1. Copy `.env.example` to `.env` (do not commit `.env`).
2. Set `DATABASE_URL` to a PostgreSQL connection URL. Set `DIRECT_URL` to a direct connection URL (Neon provides both; locally, they may be identical).
3. Generate a strong `SESSION_SECRET` (at least 32 characters).
4. Set `GROQ_API_KEY`. Optional `GROQ_MODEL` overrides the default.
5. Run:

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

6. Open `http://localhost:3000`, register an account, and use the dashboard.

## Environment variables

- `APP_BASE_URL`: canonical app URL, e.g. `http://localhost:3000`.
- `SESSION_COOKIE_NAME`: session cookie name (default is `lp_session`).
- `SESSION_SECRET`: required in production and used as the HMAC pepper for session-token hashes. Use a long random value and keep it private; raw session tokens are only held in HttpOnly cookies.
- `DATABASE_URL`, `DIRECT_URL`: Prisma/PostgreSQL URLs.
- `GROQ_API_KEY`: secret Groq key, server-only.
- `GROQ_MODEL`: optional Groq model identifier.
- `WHOP_COMPANY_API_KEY`: server-only Whop Company API key (grant `member:basic:read` and `member:email:read`). The code also accepts `WHOP_API_KEY` as a legacy alias.
- `WHOP_COMPANY_ID`, `WHOP_PRODUCT_ID`, `WHOP_PRO_PLAN_ID`: identifiers used to scope membership verification.
- `WHOP_WEBHOOK_SECRET`: secret returned when creating the Whop webhook; the webhook route validates the raw body through Whop’s official `unwrapWebhook` helper from `@whop/sdk/helpers`.
- `WHOP_PRO_CHECKOUT_URL`: documentation/reference only. Purchase buttons intentionally use the exact checkout URL supplied in the source requirement and ignore any override so they cannot silently change destinations.

## Database and migrations

```bash
npx prisma validate
npx prisma generate
npx prisma migrate dev
npm run db:deploy
npm run db:studio
```

Use `prisma migrate dev` only for local development. In production, deploy committed migration files with `npm run db:deploy`. This project does not run destructive database resets.

## Groq

Create an API key in the Groq console and put it in `GROQ_API_KEY`. The key is read only from server-side code; never prefix it with `NEXT_PUBLIC_`. AI generation is disabled with a clear error when the key is missing. Outputs are suggestions and explicitly avoid claiming live market research or fabricated competitor data.

## Whop setup

1. Confirm the supplied checkout link and session parameter are reusable for new buyers. A URL containing a pre-generated `session` might be limited, expired, or associated with an individual checkout context; only Whop can confirm whether it is reusable. The app intentionally preserves it verbatim as requested.
2. Set `WHOP_COMPANY_API_KEY`, company ID, product ID, and Pro plan ID in deployment environment variables.
3. Configure a webhook endpoint at `https://YOUR_DOMAIN/api/webhooks/whop`. Subscribe to `membership.activated`, `membership.updated`, and `membership.deactivated`; the handler also refreshes membership on `payment.succeeded`/`payment.failed` when Whop provides a membership ID in the event. Copy the webhook signing secret to `WHOP_WEBHOOK_SECRET`.
4. Ensure webhook payloads include membership/product/plan IDs and the buyer email. The handler matches by email and configured product/plan ID; it does not use a browser redirect as payment evidence.
5. The user-facing billing refresh route re-fetches the membership by ID from Whop and checks membership email and configured product/plan IDs before updating the local subscription. It never accepts client-supplied plan/status as truth.
6. Test in a Whop test environment and verify the selected membership event payloads in the Whop dashboard before going live.

**Checkout URL note:** The app keeps the precise provided URL in `lib/billing.ts` as its fallback. Because the URL includes a `session` query parameter, its validity/reusability cannot be verified without access to your Whop account. For a production flow where checkout sessions must be generated per buyer, switch the link generator to Whop's supported checkout-configuration flow using the current official SDK after you've configured the product and permissions.

## Authentication and security notes

- Email/password only; no external OAuth provider is required.
- Passwords use bcrypt. The session cookie is HttpOnly, SameSite=Lax, and Secure in production. Only a hash of the random token is stored in the database.
- Mutating API routes reject cross-origin browser requests where an Origin header is present.
- User ownership is checked server-side for project/task/competitor mutations.
- Rate limiting uses the PostgreSQL `RateLimitBucket` table, not just process memory.
- Pro access is derived from a server-side Subscription row last updated through verified membership reads/events.
- Add account email verification, password reset, operational alerting, and an email delivery provider before public production launch. These are not represented as implemented.

## Contact form

The contact form persists messages to PostgreSQL and confirms that the message was stored. It does not claim to send an email because no email delivery provider is configured.

## Tests and checks

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

External Whop, Groq, and Neon connectivity is not exercised by unit tests. Live payment/webhook verification must be confirmed in your own Whop environment.

## Vercel deployment

1. Push the source to a private or public GitHub repository.
2. Import the repository into Vercel.
3. Add every needed environment variable to the correct Vercel environments.
4. Use a managed PostgreSQL / Neon database and set both connection URLs.
5. Run migrations before routing real traffic: `npx prisma migrate deploy` as a release step. Do not depend on an ad hoc developer machine's database.
6. Deploy and configure the Whop webhook URL at the production domain.
7. Register a test account, validate free quota enforcement, trigger one test checkout, verify membership activation and deactivation, and test webhook redelivery/idempotency before launch.

## Known external configuration / launch checklist

- [ ] Create Neon/PostgreSQL database and apply migration.
- [ ] Configure Groq API key and verify the selected model is available for the account.
- [ ] Confirm the supplied Whop checkout session URL is reusable or create a Whop-supported buyer-specific checkout flow.
- [ ] Configure Whop product/plan/company IDs, API credentials, and webhook signing secret.
- [ ] Send Whop test webhook events and verify headers/payloads for the selected webhook API version.
- [ ] Replace the business/contact details in legal pages and have legal terms reviewed for the actual business.
- [ ] Configure email verification, password reset, monitoring, backups, and a contact-email delivery provider before public launch.
