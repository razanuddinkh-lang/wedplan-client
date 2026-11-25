# WedPlan — Wedding Planning Platform

**Live website:** `https://YOUR-DEPLOYED-WEDPLAN-DOMAIN.vercel.app` (replace this placeholder after deployment).

The UI uses reusable ShadCN-style primitives and includes `components.json` so additional official ShadCN components can be generated into the same alias structure.

WedPlan helps customers discover wedding services and send booking requests, helps vendors showcase services and manage enquiries, and gives administrators tools to moderate the marketplace.

## Features

- Responsive wedding-themed homepage with animated sections and service categories.
- Search, category/location filters, and ascending/descending price sorting for approved services.
- Better Auth email/password registration and optional Google authentication.
- Customer booking requests, booking status tracking, and pending-request cancellation.
- Vendor service submission, image upload through the Express API, editing, availability controls, and booking management.
- Vendor Free/Premium subscription screens, a public Premium vendor badge, and Stripe Checkout backed by verified webhooks.
- Role-aware dashboards for customers, vendors, and administrators.
- Admin user blocking, service approval/rejection, and read-only transaction reporting.

## Local development

See the root `README.md` for full setup, environment variables, Google OAuth, Stripe CLI, admin provisioning, deployment, and GitHub repository steps.

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```
