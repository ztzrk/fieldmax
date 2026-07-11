# FieldMax Project Rules & Guidelines

This document serves as the persistent guide and memory of the FieldMax project architecture and conventions for all agent interactions in this workspace.

---

## 🏗️ Core Architecture & Tech Stack

FieldMax is a monorepo managed with **pnpm** and **Turborepo**.

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui.
- **Backend**: Express.js 5, TypeScript.
- **Shared Package**: `@fieldmax/shared` containing common Zod schemas and API types.
- **Database**: PostgreSQL with Prisma ORM.
- **Auth**: Session-based using `sessionId` cookie stored in the database (no JWT).
- **Payment Gateway**: Midtrans Snap (locale-specific to Indonesia).
- **CDN**: ImageKit for image uploads.
- **Mail Service**: Nodemailer (SMTP).

---

## 📂 Project Structure Reference

- **Backend**: `/backend/src`
  - Routes, controllers, and services are decoupled.
  - Manual Dependency Injection is configured in `backend/src/index.ts` (composition root).
- **Frontend**: `/frontend/src`
  - **Services**: `src/services/` (Axios API wrappers).
  - **Hooks**: `src/hooks/` (React Query wrappers around services).
  - **Pages**: `src/app/` (Next.js App Router).
- **Shared Code**: `/packages/shared/src`

---

## 🛠️ Code Conventions & Patterns

### 1. Backend Module Pattern
Every backend feature should follow the three-tier layer architecture:
1. `*.service.ts` - All database operations (Prisma) and business logic.
2. `*.controller.ts` - HTTP request/response wrapper, inputs validation, calling services.
3. `*.route.ts` - Express router bindings, utilizing validation and authentication middlewares.
Register new routes/controllers/services in [backend/src/index.ts](file:///c:/Users/Ztzrk/Documents/fieldmax/backend/src/index.ts).

### 2. Frontend Data Fetching
- Do NOT invoke services or make direct Axios calls inside pages/components.
- Always use or create a custom React Query hook in `frontend/src/hooks/` that calls the corresponding service in `frontend/src/services/`.

### 3. Authentication
- Authenticated routes on the backend must use `authMiddleware` (checks `sessionId` cookie).
- Role-based permissions use `permissionMiddleware` or `adminMiddleware`.
- Frontend consumes authentication state globally via `useAuth()` from `AuthProvider`.

### 4. Database Schema
- The database schema is defined in [schema.prisma](file:///c:/Users/Ztzrk/Documents/fieldmax/backend/prisma/schema.prisma).
- ID fields default to UUID.
- Always write proper PostgreSQL database migrations (`npx prisma migrate dev`) when editing the schema.

### 5. Localization
- The application targets the Indonesian market. User-facing text, alerts, notifications, and dashboard strings in the frontend must remain in **Bahasa Indonesia** unless requested otherwise. Code structure, APIs, logs, and comments must be in **English**.
