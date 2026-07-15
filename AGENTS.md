# FieldMax — Agent Guide

This document serves as the persistent guide and memory of the FieldMax project architecture,
conventions, and available tools for all AI agent interactions in this workspace.

---

## 🏗️ Core Architecture & Tech Stack

FieldMax is a sports field booking platform targeting the Indonesian market, built as a
**pnpm monorepo** with **Turborepo**.

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (new-york style) | Port `3001` |
| **Backend** | Express.js 5, TypeScript | Controller → service → route pattern |
| **Shared** | `@fieldmax/shared` (workspace package) | Zod schemas + API types |
| **Database** | PostgreSQL + Prisma ORM | UUID keys, `npx prisma migrate dev` for changes |
| **Auth** | Session-based (`sessionId` cookie in DB) | No JWT |
| **Payments** | Midtrans Snap | Indonesia-specific |
| **CDN** | ImageKit | Image uploads |
| **Mail** | Nodemailer (SMTP) | `fieldmax.ofc@gmail.com` |
| **Package manager** | pnpm (v10.12.4) | Always use `pnpm` |


---

## 📂 Project Structure

```
fieldmax/
├── frontend/src/          # Next.js App Router
│   ├── app/               # Pages & layouts (home, bookings, admin, renter, auth…)
│   ├── components/        # shadcn/ui + domain (VenueCard, …)
│   ├── hooks/             # React Query wrappers
│   ├── services/          # Axios API wrappers
│   ├── lib/               # Utilities + client-side Zod schemas
│   ├── config/            # Dashboard configs
│   ├── context/           # AuthContext (useAuth)
│   └── types/             # TypeScript types
├── backend/src/           # Express API
│   ├── index.ts           # Composition root (DI + server)
│   ├── auth/              # Register, login, verify-email, reset-password
│   ├── bookings/          # CRUD + availability
│   ├── venues/            # Venue management
│   ├── fields/            # Field management
│   ├── payments/          # Midtrans integration
│   ├── reviews/           # Reviews & ratings
│   ├── reports/           # Admin reporting
│   ├── dashboard/         # Dashboard stats
│   ├── home/              # Public homepage data
│   ├── profile/           # User profile
│   ├── renter/            # Renter endpoints
│   ├── users/             # User management (admin)
│   ├── sport-types/       # Sport type CRUD
│   ├── uploads/           # Image upload (ImageKit)
│   ├── middleware/         # auth, admin, validation, rateLimit
│   ├── schemas/           # Zod request validation schemas
│   ├── services/          # Cron jobs
│   ├── config/            # env.ts, midtrans.ts
│   ├── db/                # Prisma client singleton
│   ├── lib/               # imagekit.ts, mailer.ts
│   ├── utils/             # asyncHandler, errors, logger, response
│   └── types/             # Express augmentation
├── packages/shared/src/   # @fieldmax/shared — shared Zod schemas & types
├── diagram/               # Custom draw.io MCP server
│   └── src/               # index.js, shared.js, worker.js
├── obsidian/Fieldmax/     # Academic thesis vault (BAB I-IV)
├── shared/                # Mermaid & shape search reference files
├── opencode.json          # MCP configuration
├── pnpm-workspace.yaml
└── turbo.json
```


---

## 🛠️ Code Conventions

### Backend Module Pattern

Every feature: `*.service.ts` → `*.controller.ts` → `*.route.ts`.
Register in `backend/src/index.ts` (composition root, manual DI).

### Frontend Data Fetching

- Never call Axios directly in pages/components
- Use React Query hooks in `hooks/` wrapping services in `services/`
- Handle loading/error/empty states

### Styling

- Tailwind CSS v4 for all styling
- shadcn/ui (new-york, neutral base, CSS variables)
- Icons: lucide-react

### Auth

- Backend: `authMiddleware` checks `sessionId` cookie, `adminMiddleware` for role checks
- Frontend: `useAuth()` from `AuthContext`

### Database

- Schema: `backend/prisma/schema.prisma` — **read it first** before data work
- UUID primary keys, Prisma migrations only
- `PrismaClient` singleton at `backend/src/db/index.ts`
- Zod-validate before DB, no raw SQL unless necessary
- Preferred seeder: `simulation.ts`

### Error Handling

- `asyncHandler` wrapper on all async routes
- Typed errors from `utils/errors.ts` (`NotFoundError`, `BadRequestError`, …)
- No raw DB errors to client

### TypeScript

- Strict mode everywhere, avoid `any`
- Backend: CommonJS, ES2016
- Frontend: ESNext, bundler resolution

### Localization

- User-facing text: **Bahasa Indonesia**
- Code/logs/comments: **English**

### Formatting

- 4-space indentation, Prettier/ESLint defaults


---

## 🧰 MCP Server Configuration

Configured in `opencode.json`. Available toolkits for agent use:

### 🔵 Enabled Servers

| Server | Purpose | Notes |
|--------|---------|-------|
| `context7` | Library/framework docs | `@upstash/context7-mcp` |
| `github` | GitHub API | PAT configured |
| `codebase-memory-mcp` | Persistent codebase memory | Local exe |
| `obsidian` | Thesis vault read/write | `obsidian/Fieldmax` |
| `drawio` | Standard draw.io diagrams | `@drawio/mcp` |
| `drawio-app` | **Custom** draw.io MCP | `diagram/src/index.js --stdio` — Mermaid, ELK layout, shape search |
| `tavily-remote-mcp` | Web search | Tavily API |
| `memory` | Knowledge graph memory | `@modelcontextprotocol/server-memory` |
| `filesystem` | Filesystem access | `@modelcontextprotocol/server-filesystem` |

### 🔴 Disabled

| Server | Purpose |
|--------|---------|
| `excel` | Excel manipulation |
| `mysql` | `simpus_andalasdb` (read-only, separate DB) |
| `pdf-reader` | PDF reading |

### When to Use Each

- **Draw diagrams**: `drawio` or `drawio-app` → `.drawio` and `.png` exports
- **Thesis work**: `obsidian` → read/write the vault
- **Web research**: `tavily-remote-mcp`
- **Framework docs**: `context7`
- **Persist findings**: `memory` (knowledge graph across sessions)


---

## 🗄️ Database Overview

Connection: `postgresql://postgres:root@localhost:5432/fieldmax`

Key tables (full schema at `backend/prisma/schema.prisma`):

- `users` — id, email, fullName, phoneNumber, passwordHash, role, verificationStatus, photo
- `sessions` — id, userId, expiresAt
- `venues` — id, name, address, description, lat/lng, status, rejectionReason, renterId
- `fields` — id, name, description, status, basePrice, sportTypeId, venueId
- `sport_types` — id, name
- `bookings` — id, fieldId, userId, startTime, endTime, totalPrice, status
- `payments` — id, bookingId, amount, status, midtransOrderId, paymentMethod
- `reviews` — id, userId, fieldId, bookingId, rating, comment
- `reports` — id, reporterId, reportedUserId, type, description, status, adminReply
- `venue_photos` / `field_photos` — id, parentId, url
- `password_reset_tokens` / `email_verification_tokens` — id, userId, token, expiresAt


---

## 🖥️ Common Commands

```bash
pnpm dev                          # Run frontend + backend (Turborepo)

# Backend
cd backend
pnpm dev                          # nodemon + ts-node
npx prisma migrate dev --name <n> # Create migration
npx prisma db seed                # Run seeders
npx prisma studio                 # DB GUI

# Frontend
cd frontend
pnpm dev                          # Next.js dev on port 3001
pnpm build                        # Production build

# Shared package
cd packages/shared
pnpm build                        # Compile TypeScript

# Diagram MCP
cd diagram
npm start                         # HTTP server (port 3001)

---

## 🖼️ Diagram MCP Server (`diagram/`)

Custom draw.io MCP at `diagram/src/index.js`:

- **Modes**: STDIO (`--stdio` for MCP clients) + HTTP (Express)
- **Tools**: `new_diagram`, `edit_diagram`, `get_diagram`, `export_diagram`, `search_shapes`
- **Resources**: `mermaid-reference`, `xml-reference` (from root `shared/`)
- **Renderer**: draw.io viewer + ELK layout + Mermaid parser (26 diagram types)
- **Edge routing**: libavoid (orthogonal, obstacle-avoiding) from viewer.diagrams.net CDN
- **Shape search**: ~10K shapes pre-indexed in memory
- **Convention**: Allman brace style, `function()` over arrow callbacks

See `diagram/CLAUDE.md` for full architecture.

---

## 📝 Obsidian Vault (`obsidian/Fieldmax/`)

Academic thesis in Bahasa Indonesia:
- `01-05`: Title, abstract, ToC, figures, tables
- `06-09`: BAB I-IV (Pendahuluan, Metode, Hasil dan Pembahasan, Kesimpulan)
- `10-11`: References, appendices
- `images/`: Research figures (`.drawio` + `.svg`)

Use the `obsidian` MCP server to read/write vault files.

---

## ⚠️ Important Rules

1. **Always use pnpm** — never npm or yarn
2. **Read schema.prisma** before any database work
3. **Follow existing patterns** — check similar controllers/services/hooks first
4. **Don't break Prisma relations** when refactoring
5. **Bahasa Indonesia** for user-facing text, **English** for code/comments
6. **Frontend on port 3001** — the diagram MCP HTTP mode also uses 3001
7. **Backend uses nodemon + ts-node** for dev, not a fixed port (configured in index.ts)

