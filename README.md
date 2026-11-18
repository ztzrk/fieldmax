# FieldMax 🏟️

FieldMax is a full-stack sports venue discovery and field booking platform tailored for the Indonesian market. Built as a **pnpm + Turborepo** monorepo, it connects athletes (**Users**) with venue owners (**Renters**) and platform **Admins** through real-time slot availability, **Midtrans Snap** online payments, QR code check-ins, and review/reporting workflows.

## 🌐 Live Demo

- **Frontend App:** [https://fieldmax.vercel.app/](https://fieldmax.vercel.app/)
- **Backend API:** [https://fieldmax-backend.vercel.app/](https://fieldmax-backend.vercel.app/)
- **Health Check:** [https://fieldmax-backend.vercel.app/api/health](https://fieldmax-backend.vercel.app/api/health)

## 🚀 Features

### For Users (Athletes)

- **Venue & Field Discovery:** Search and filter sports venues and fields by location, sport type, price, and availability.
- **Real-Time Slot Booking:** Check live hourly schedules and book fields without double-booking.
- **Online Payments (Midtrans Snap):** Pay securely via Midtrans Snap with automatic payment status synchronization.
- **QR Code E-Tickets:** Generate booking QR codes for fast on-site check-in at the venue.
- **Booking History & Reviews:** Track booking statuses (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`) and leave ratings/reviews after completed sessions.
- **Issue Reporting:** Submit reports (`SCAM`, `TECHNICAL`, `PAYMENT`, `OTHER`) with attachments and communicate through threaded replies.
- **Account Security:** Session-based authentication, email verification, password reset, and profile management.

### For Renters (Venue Owners)

- **Venue & Field Management:** Manage venues, operating hours (`VenueSchedule`), photos (ImageKit), sport types, hourly pricing, and field closure toggles.
- **Approval Workflow:** Track venue and field verification statuses (`DRAFT`, `PENDING`, `APPROVED`, `REJECTED`) with admin rejection feedback.
- **QR Code Check-In Scanner:** Scan player booking QR codes directly in the browser to verify arrivals.
- **Analytics & Revenue Dashboard:** Monitor bookings, occupancy trends, and revenue charts.
- **Public Renter Profile:** Customize company branding, logo, description, and website.

### For Admins

- **Platform Dashboard:** Overview of users, venues, bookings, and platform metrics.
- **Venue & Field Verification:** Approve or reject submitted venues and fields with detailed reasons.
- **User & Sport Type Management:** Manage user accounts and configure supported sport categories.
- **Booking & Report Oversight:** Monitor platform bookings and resolve user/renter reports via threaded replies.

### Automated Background Jobs (`node-cron`)

Runs every 15 minutes (when not running in serverless mode) to:
- Auto-complete checked-in bookings and mark unchecked past `CONFIRMED` bookings as `NO_SHOW`.
- Cancel stale `PENDING` bookings and expire unpaid `PENDING` payments older than 30 minutes.
- Prune expired user sessions from the database.

## 🛠️ Tech Stack

**Monorepo & Shared:**
- **Package Manager & Build:** pnpm (`10.12.4`) Workspaces & Turborepo
- **Shared Package (`@fieldmax/shared`):** Shared Zod validation schemas and TypeScript API types

**Frontend (`frontend/`):**
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) & React 19
- **Language:** TypeScript
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix UI), [Lucide React](https://lucide.dev/)
- **Data & Forms:** TanStack React Query, TanStack React Table, Axios, React Hook Form, Zod
- **Utilities & Visualization:** Recharts, `qrcode.react`, `html5-qrcode`, `date-fns`, Sonner

**Backend (`backend/`):**
- **Runtime & Framework:** Node.js, [Express.js 5](https://expressjs.com/), TypeScript
- **Database & ORM:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** Database-backed HTTP-only session cookies (`sessionId`) with `bcryptjs`
- **Payments:** [Midtrans Snap](https://midtrans.com/) (`midtrans-client`)
- **Media Storage:** [ImageKit](https://imagekit.io/) + Multer
- **Email & Scheduling:** Nodemailer (SMTP) & `node-cron`
- **Security & Validation:** Helmet, CORS, `express-rate-limit`, `envalid`, Zod

## 📦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v10 recommended: `corepack enable` or `npm install -g pnpm`)
- **PostgreSQL** database (local or hosted such as Supabase / Neon)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/ztzrk/fieldmax.git
    cd fieldmax
    ```

2. **Install all workspace dependencies**

    ```bash
    pnpm install
    ```

3. **Build the shared package**

    ```bash
    pnpm --filter @fieldmax/shared build
    ```

4. **Configure Backend Environment & Database**

    Copy the example environment file and fill in your PostgreSQL, Midtrans, ImageKit, and SMTP credentials:

    ```bash
    cp backend/.env.example backend/.env
    ```

    Run Prisma migrations and optionally seed the database:

    ```bash
    cd backend
    npx prisma migrate dev

    # Optional: seed database (simulation dataset or default seed)
    pnpm run seed:sim
    # or: npx prisma db seed
    cd ..
    ```

5. **Configure Frontend Environment**

    ```bash
    cp frontend/.env.example frontend/.env.local
    ```

    For local development, set:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    BACKEND_API_URL=http://localhost:3000
    ```
    *(In production with Next.js rewrites, set `NEXT_PUBLIC_API_URL=/api` and `BACKEND_API_URL` to your deployed backend URL so session cookies stay same-origin.)*

6. **Start Development Servers**

    Run both frontend and backend concurrently from the repository root using Turborepo:

    ```bash
    pnpm dev
    ```

    - **Frontend:** [http://localhost:3001](http://localhost:3001)
    - **Backend API:** [http://localhost:3000](http://localhost:3000)
    - **Health Check:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

## 🧰 Useful Commands

```bash
# Run frontend & backend in development mode
pnpm dev

# Build shared package, backend, or frontend
pnpm --filter @fieldmax/shared build
pnpm --filter fieldmax-backend build
pnpm --filter fieldmax-frontend build

# Backend database & seeding
cd backend
npx prisma studio               # Open Prisma Studio GUI
npx prisma migrate dev          # Create & apply migrations
pnpm run seed:main              # Default seed
pnpm run seed:sim               # Simulation dataset seed
pnpm run seed:large             # Large dataset seed
```

## ☁️ Deployment

The repository includes deployment configurations for **Vercel** (`frontend/vercel.json` and `backend/vercel.json`) and **Render** (`render.yaml`):

- **Frontend (Vercel):** Set `NEXT_PUBLIC_API_URL=/api` and `BACKEND_API_URL=https://fieldmax-backend.vercel.app` so Next.js rewrites (`/api/:path*`) keep session cookies on the same origin.
- **Backend (Vercel / Render):** Configure `FRONTEND_URL=https://fieldmax.vercel.app` and `BACKEND_URL=https://fieldmax-backend.vercel.app` along with database, Midtrans, ImageKit, and SMTP environment variables. Note that `node-cron` background jobs are disabled when `VERCEL=1` (serverless mode).

## 📂 Project Structure

```text
fieldmax/
├── backend/                    # Express.js 5 API (controller -> service -> route)
│   ├── prisma/
│   │   ├── migrations/         # PostgreSQL migrations
│   │   ├── seeds/              # Database seeders (seed, simulation, large-dataset)
│   │   └── schema.prisma       # Prisma database schema
│   ├── src/
│   │   ├── auth/               # Register, login, sessions, verify-email, reset-password
│   │   ├── bookings/           # Booking lifecycle, availability, QR check-in
│   │   ├── config/             # Environment validation (envalid) & Midtrans client
│   │   ├── dashboard/          # Admin & renter analytics
│   │   ├── db/                 # Prisma client singleton
│   │   ├── fields/             # Field management
│   │   ├── home/               # Public homepage data
│   │   ├── lib/                # ImageKit & Nodemailer helpers
│   │   ├── middleware/         # Auth, role checks, validation, rate limit, errors
│   │   ├── payments/           # Midtrans Snap & webhook handling
│   │   ├── profile/            # User & renter profile endpoints
│   │   ├── renter/             # Renter-specific endpoints
│   │   ├── reports/            # Reporting & threaded replies
│   │   ├── reviews/            # Field reviews & ratings
│   │   ├── schemas/            # Backend Zod schemas
│   │   ├── services/           # Automated cron jobs
│   │   ├── sport-types/        # Sport category CRUD
│   │   ├── uploads/            # ImageKit upload endpoints
│   │   ├── users/              # Admin user management
│   │   ├── utils/              # asyncHandler, custom errors, logger, response
│   │   ├── venues/             # Venue & schedule management
│   │   └── index.ts            # Composition root & Express server
│   └── .env.example
├── frontend/                   # Next.js 16 (App Router) application
│   ├── src/
│   │   ├── app/                # App Router pages (home, search, venues, fields, bookings, renter, admin, auth, reports)
│   │   ├── components/         # shadcn/ui & domain components
│   │   ├── config/             # Dashboard navigation & app config
│   │   ├── context/            # AuthContext (useAuth)
│   │   ├── hooks/              # React Query hooks
│   │   ├── lib/                # Utilities & client-side helpers
│   │   ├── services/           # Axios API service wrappers
│   │   └── types/              # Frontend TypeScript types
│   └── .env.example
├── packages/
│   └── shared/                 # @fieldmax/shared (shared Zod schemas & types)
├── pnpm-workspace.yaml         # Workspace package definitions
├── turbo.json                  # Turborepo pipeline configuration
├── render.yaml                 # Render deployment blueprint for backend
└── package.json                # Root monorepo scripts
```
