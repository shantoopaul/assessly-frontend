# 📝 Assessly — Developer Assessment Platform

> A structured, role-based developer assessment platform built with Next.js App Router, TypeScript, TanStack Query, Zustand, and Stripe. Candidates take timed assessments, reviewers author & grade them, and admins oversee the whole lifecycle with full audit trails.

---

## 📦 Submission Details

```text
Project Name            : Developer Assessment Platform (Assessly)
Backend Repo            : https://github.com/shantoopaul/assessly-backend
Frontend Repo           : https://github.com/shantoopaul/assessly-frontend
Live Backend URL        : https://assessly-backend-ruby.vercel.app
Live Frontend URL       : https://assessly-pi.vercel.app
API Documentation       : https://documenter.getpostman.com/view/55072385/2sBYB2rnKS
```

> 🔐 **Note:** The three demo accounts (Admin / Reviewer / Candidate) are seeded on the backend specifically for evaluation. Each can also be accessed via the **One-Click Demo Login** buttons on the `/login` page.

---

## 🎯 Project Overview

**Assessly** is a full-stack developer assessment platform with three distinct user roles, each with their own focused dashboard and workflows:

| Role | Capabilities |
|------|-------------|
| **CANDIDATE** | Browse published assessments, enroll (free or Stripe-paid), take timed attempts, view scores, reviewer feedback, and payment history. |
| **REVIEWER** | Author assessments with MCQ / TEXT / CODE questions, publish them, claim submissions from a review queue, grade free-form answers, and issue PASS/FAIL verdicts. |
| **ADMIN** | Manage users (role & status changes), oversee all assessments, inspect the audit log, and monitor platform-wide analytics. |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router, React Server Components, Turbopack) |
| **Language** | TypeScript (strict, no `any`) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui (base-sera style) + `@base-ui/react` |
| **Server State** | TanStack Query v5 |
| **Client State** | Zustand (persisted auth store) |
| **Forms & Validation** | `@tanstack/react-form` + Zod |
| **Auth** | Custom JWT (HTTP-only cookies) + `jwt-decode` |
| **Payments** | Stripe Checkout (Test Mode) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **HTTP Client** | `ofetch` (custom typed API client with refresh-token retry) |
| **Linting / Format** | Biome |
| **Deployment** | Vercel |

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based auth with access + refresh tokens stored in **HTTP-only cookies**
- **Middleware (`src/proxy.ts`)** enforces role-based route protection at the edge — `/admin`, `/reviewer`, `/candidate` namespaces are gated
- Role mismatch redirects automatically to the correct dashboard
- Auth state persisted client-side via Zustand (`assessly-auth`)
- Auto-refresh on `401` in the API client (`apiClient.ts`)
- **Google OAuth** login via `@react-oauth/google`

### 🚀 One-Click Demo Login
The `/login` page exposes three buttons — **Admin**, **Reviewer**, **Candidate** — that instantly authenticate the user and redirect to the correct role dashboard. No typing required.

### 📊 Role-Based Dashboards
- `dashboard-shell.tsx` — responsive sidebar + header wrapper
- `dashboard-sidebar.tsx` — role-aware navigation menu
- `dashboard-overview.tsx` — role-specific landing cards

### 🧭 URL State Synchronization
Every list view (`/admin/users`, `/admin/audit-logs`, `/admin/assessments`, `/reviewer/assessments`, `/reviewer/reviews`, `/candidate/attempts`, `/candidate/payments`) syncs **search, filter, sort, and pagination** to the URL via `useSearchParams` — views are bookmarkable and shareable.

### 💳 Stripe Payment Flow
- `/payment/checkout` — initiates a Checkout Session, redirects to Stripe
- `/payment/success` — waits for the webhook grace period, invalidates caches, confirms enrollment
- `/payment/cancel` — safe fallback with retry
- Paid attempts move `PENDING_PAYMENT → READY` after Stripe webhook confirmation

### 📝 Complex Form Workflows
- **Create Assessment Wizard** (`/reviewer/assessments/create`) — 2-step form: details → dynamic question builder (MCQ / TEXT / CODE with add/remove options)
- **Evaluate Attempt** (`/reviewer/reviews/[attemptId]`) — per-question scoring + feedback with a final decision
- **Profile & Avatar Upload** — Cloudinary-backed with preview & size/type validation

### 📈 Analytics
- **Admin** — platform-wide stats (users, assessments, attempts, revenue) + Recharts bar chart
- **Reviewer** — assessment status distribution, review queue breakdown, pass/fail outcomes

### 🧱 Robust UX States
- **`loading.tsx`** skeletons on every data-fetching page
- **`error.tsx`** error boundaries scoped per dashboard segment (admin / reviewer / candidate) + global
- **Empty states** (`EmptyState`) with icons and CTAs on every list
- **Toast notifications** via Sonner for API errors, success actions, and confirmation flows
- **`ConfirmDialogProvider`** — accessible AlertDialog for destructive actions

### ♿ Accessibility
- ARIA labels on interactive icons
- Focus-visible outlines everywhere
- Keyboard-navigable dropdowns, dialogs, and forms
- `role="alert"` on validation errors
- Semantic headings & landmarks

---

## 📄 Pages Implemented (27+ Routes)

### 🌐 Public Pages
| Route | Description |
|-------|-------------|
| `/` | Marketing landing (hero, stats, features, how-it-works, roles, FAQ, CTA) |
| `/about-us` | Mission, values, role overview |
| `/contact-us` | Contact channels + Web3Forms contact form |
| `/login` | Login with One-Click Demo buttons + Google OAuth |
| `/register` | Candidate registration with validation |

### 🔐 Auth-Protected — Admin
| Route | Description |
|-------|-------------|
| `/admin` | Overview dashboard with role-specific quick links |
| `/admin/analytics` | Platform stats + Recharts bar chart |
| `/admin/users` | User management (filter, search, role, status, soft-delete) |
| `/admin/assessments` | All assessments with publish/archive |
| `/admin/audit-logs` | Searchable, filterable audit log |
| `/admin/profile` | Admin profile & avatar upload |

### 🎓 Auth-Protected — Candidate
| Route | Description |
|-------|-------------|
| `/candidate` | Overview with quick links |
| `/candidate/assessments` | Browse published assessments |
| `/candidate/attempts` | Attempt history with status filter |
| `/candidate/attempts/[attemptId]` | Take attempt (live timer, MCQ / TEXT / CODE), result view |
| `/candidate/payments` | Payment history + retry |
| `/candidate/profile` | Profile & avatar |

### 📝 Auth-Protected — Reviewer
| Route | Description |
|-------|-------------|
| `/reviewer` | Overview |
| `/reviewer/assessments` | Manage assessments with status filter |
| `/reviewer/assessments/create` | 2-step wizard (details → questions) |
| `/reviewer/assessments/[id]` | Detail + inline question CRUD editor |
| `/reviewer/reviews` | Review queue — claim attempts |
| `/reviewer/reviews/[attemptId]` | Evaluate per-answer scoring + overall feedback |
| `/reviewer/analytics` | Reviewer analytics with charts |
| `/reviewer/profile` | Reviewer profile |

### 💳 Payment Flow
| Route | Description |
|-------|-------------|
| `/payment/checkout` | Initiates Stripe Checkout Session |
| `/payment/success` | Post-payment confirmation + cache sync |
| `/payment/cancel` | Cancellation fallback |

### 🧭 Utility
| Route | Description |
|-------|-------------|
| `not-found.tsx` | Custom 404 |
| `error.tsx` | Global error boundary |
| `(dashboard)/*/error.tsx` | Per-role error boundaries |
| `(dashboard)/*/loading.tsx` | Per-route skeleton loaders |

---

## 🏗️ Architecture Highlights

### Server vs. Client Components
- **Server Components by default** — layouts, marketing pages, metadata exports
- **`"use client"` only where needed** — forms, hooks, stateful dashboards, charts
- `metadata` / `generateMetadata` used for SEO on all public pages
- `Next.js Viewport` API for theme color and scaling

### API Layer (`src/api/`)
One file per resource (`auth`, `assessments`, `attempts`, `reviews`, `payments`, `users`, `admin`). A single `apiClient` (`src/lib/apiClient.ts`) wraps `ofetch` and handles:
- Credentials (`credentials: "include"`)
- Normalized `ApiError` with status codes
- **Single-flight refresh-token retry** on `401`

### State Management
- **TanStack Query** for all server-state with per-resource query keys and invalidation
- **Zustand** for auth (persisted) and UI state
- Custom hooks per domain (`useAuth`, `useAssessments`, `useAttempts`, `useReviews`, `usePayments`, `useUsers`, `useAuditLogs`, `useAdminStats`)

### Forms
- `@tanstack/react-form` + Zod everywhere
- Schema validation mirrors backend rules
- `Field` wrapper standardizes labels, hints, and `role="alert"` errors

### Reusable Components
`Button`, `Card`, `Field`, `Input`, `Label`, `Skeleton`, `DropdownMenu`, `Tooltip`, `Separator`, `AlertDialog`, `EmptyState`, `ErrorState`, `PageHeader`, `StatCard`, `StatusPill`, `DashboardShell`, `DashboardSidebar`, `DashboardHeader`, `ProfileView`, `ConfirmDialogProvider`, `FilterForm` (per resource)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm / npm / yarn
- Access to the backend API (live or local)

### 1. Clone & Install

```bash
git clone https://github.com/shantoopaul/assessly-frontend.git
cd assessly-frontend
npm install
```

### 2. Environment Variables

Create `.env.local` at the project root:

```bash
NEXT_PUBLIC_API_BASE_URL=/api/v1
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_WEB3FORMS_KEY=
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Lint & Format

```bash
npm run lint      # biome check
npm run format    # biome format --write
```

### 5. Production Build

```bash
npm run build
npm run start
```

---

## 🔑 Demo Credentials

The backend ships with three seeded accounts. You can either use the One-Click Demo buttons on `/login` or log in manually:

| Role | Email | Password |
|------|-------|----------|
| **ADMIN** | `testeradmin@gmail.com` | `Tester@admin12345` |
| **REVIEWER** | `testerreviewer@gmail.com` | `Tester@reviewer12345` |
| **CANDIDATE** | `testercandidate@gmail.com` | `Tester@candidate12345` |

> ⚠️ These are **evaluation-only** accounts and are not tied to any production user.

---

## 🧪 Testing the Full Workflow (End-to-End)

1. **Login as Reviewer** → `/reviewer/assessments/create` → build a 2-3 question assessment → **Publish**
2. **Logout → Login as Candidate** → `/candidate/assessments` → **Enroll** in the published assessment
   - If it's a **paid** assessment → complete **Stripe Checkout** in Test Mode (`4242 4242 4242 4242`)
   - Success redirect confirms the attempt moves to `READY`
3. **Take the attempt** — timer starts, answers auto-save, submit when ready
4. **Logout → Login as Reviewer** → `/reviewer/reviews` → **Claim** the attempt → **Evaluate** free-form answers → submit
5. **Login as Candidate** → `/candidate/attempts/[id]` → view score + reviewer feedback
6. **Login as Admin** → `/admin/audit-logs` → verify every step above is recorded
7. Try `/admin/users` → change a role or block a user → check `/admin/audit-logs` again

---

## 📁 Project Structure (Highlights)

```
src/
├── api/                 # One file per API resource (typed)
├── app/
│   ├── (dashboard)/     # Auth-protected segments
│   │   ├── admin/
│   │   ├── candidate/
│   │   └── reviewer/
│   ├── (public)/
│   │   ├── (authentication)/login, /register
│   │   └── (marketing)/, /about-us, /contact-us
│   ├── payment/         # /checkout, /success, /cancel
│   ├── error.tsx
│   ├── not-found.tsx
│   └── layout.tsx
├── components/
│   ├── admin/ auth/ candidate/ dashboard/ marketing/ reviewer/ shared/ ui/
├── constants/           # ROLES, ROUTES, ROLE_HOME
├── hooks/               # one per domain (React Query wrappers)
├── lib/                 # apiClient, attempts utils, payments, toast
├── providers/           # QueryProvider, GoogleAuthProvider, ConfirmDialogProvider
├── proxy.ts             # Next.js middleware (role-based protection)
├── store/               # Zustand auth store
├── types/               # TypeScript domain types (no `any`)
└── validation/          # Zod schemas (auth, assessments, reviews, users)
```

---

## 🧭 Middleware & Route Protection

`src/proxy.ts` guards every `/admin`, `/reviewer`, and `/candidate` route:

- **No access token + no refresh token** → redirect to `/login?callbackUrl=…`
- **Expired access token + valid refresh token** → allow through (client-side refresh handles it)
- **Valid token, wrong role** → redirect to that role's home (`ROLE_HOME[role]`)
- **Authenticated user hits `/login` or `/register`** → redirect to their dashboard
- **`/payment/*`** is excluded from the matcher so Stripe redirects are not blocked

---

## 🎨 Design System

- **Color palette:** OKLCH-based primary (red/crimson) with light/dark tokens
- **Typography:** Montserrat (Google Fonts) via `next/font`
- **Radius:** `--radius: 0.625rem` (sharp, editorial feel)
- **Dark mode:** Fully supported via `.dark` class
- **Consistent theming** across all role dashboards, marketing pages, and auth flows

---

## ✅ Requirements Checklist

| Requirement | Status |
|-------------|:------:|
| Next.js App Router (layouts, page, error, loading) | ✅ |
| Server / Client component split | ✅ |
| Tailwind CSS + shadcn/ui | ✅ |
| JWT auth + middleware protection | ✅ |
| Role-based UI rendering (3 roles) | ✅ |
| One-Click Demo Login for all 3 roles | ✅ |
| TanStack Query + Zustand | ✅ |
| `@tanstack/react-form` + Zod on all forms | ✅ |
| Stripe Checkout integration (Test Mode) | ✅ |
| Loading skeletons on every fetching page | ✅ |
| Empty states on all list views | ✅ |
| Error boundaries (`error.tsx` scoped per role) | ✅ |
| URL state sync for filters/pagination | ✅ |
| `next/image` for all images | ✅ |
| Recharts data visualization | ✅ |
| Multi-step wizard (Create Assessment) | ✅ |
| File upload (avatar via Cloudinary) | ✅ |
| Custom 404 + Global error | ✅ |
| SEO metadata (title, description, OG) | ✅ |
| 18+ fully functional pages | ✅ (27+) |
| Meaningful commit history | ✅ |
| Live Vercel deployment | ✅ |

---

## 📤 Submission Template (Copy-Paste Ready)

```text
Project Name            : Developer Assessment Platform (Assessly)
Backend Repo            : https://github.com/shantoopaul/assessly-backend
Frontend Repo           : https://github.com/shantoopaul/assessly-frontend
Live Backend URL        : https://assessly-backend-ruby.vercel.app
Live Frontend URL       : https://assessly-pi.vercel.app
API Documentation       : https://assessly-backend-ruby.vercel.app/docs
Demo Video              : 
Demo Admin Email        : testeradmin@gmail.com
Demo Admin Password     : Tester@admin12345
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org)
- [TanStack](https://tanstack.com) (Query, Form)
- [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com)
- [Stripe](https://stripe.com)
- [Recharts](https://recharts.org)
- [Sonner](https://sonner.emilkowal.ski)

---

> 💡 Built as a portfolio-grade demonstration of Next.js App Router architecture, modern state management, role-based access control, and full-stack Stripe integration.