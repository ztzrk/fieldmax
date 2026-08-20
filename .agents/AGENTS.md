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

### 6. Academic Thesis Writing Guidelines (Unhas 2023)
*Reference: Pedoman Penulisan Tugas Akhir Mahasiswa Universitas Hasanuddin (SK Rektor No: 10438/UN4.1/KEP/2023)*
- **No Separate Literature Review Chapter**: All theoretical foundations and literature review are integrated into **BAB I (1.1 Latar Belakang & 1.6 Landasan Teori)**.
- **Paper & Layout**: **B5 (176 mm x 250 mm)**, Margin **2.25 cm** all sides, Font **Arial** across the entire document.
- **Typography**: Chapter titles Arial 11 pt Bold Center, Subheadings Arial 10 pt Bold Left, Body text Arial 10 pt Justified with 1.15 line spacing and 1.25 cm first-line indentation (0 cm for the first paragraph after a heading).
- **Tables & Figures**: Table titles ABOVE table (Arial 10 pt, single space, no trailing period), Figure titles BELOW image (Arial 10 pt, single space, no trailing period). Continuous numbering across entire thesis.
- **Citations**: Harvard / APA Style 7th edition (`Author, Year`), use **et al.** (not dkk, not italicized).
- **Word Conversion**: Always use `convert_proposal_to_docx.py` to produce official formatted `.docx` files.
