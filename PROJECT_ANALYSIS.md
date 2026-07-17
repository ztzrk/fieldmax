# FieldMax — Comprehensive Project Analysis

## 1. Project Overview

**FieldMax** is a sports field booking platform targeting the **Indonesian market**. It allows users to browse and book sports fields, venue owners (renters) to manage their venues and fields, and administrators to oversee the entire platform. The system includes payment processing via **Midtrans**, image hosting via **ImageKit**, email notifications via **Nodemailer SMTP**, and session-based authentication.

| Attribute | Value |
|-----------|-------|
| **Name** | FieldMax |
| **Repository** | `https://github.com/ztzrk/fieldmax.git` |
| **Current Branch** | `main` |
| **Latest Commit** | `5693c61` |
| **Package Manager** | pnpm v10.12.4 |
| **Monorepo Tool** | Turborepo v2.7.2 |
| **Language** | TypeScript (strict mode everywhere) |
| **User-facing Language** | Bahasa Indonesia |
| **Code/Logs/Comments Language** | English |

---

## 2. Monorepo Structure

```
fieldmax/
├── backend/              # Express.js 5 REST API (port 3000)
│   ├── src/
│   │   ├── index.ts          # Composition root (DI wiring + Express server)
│   │   ├── auth/             # Register, login, verify, forgot/reset password
│   │   ├── bookings/         # Booking CRUD + availability
│   │   ├── dashboard/        # Admin & renter dashboard stats/charts
│   │   ├── fields/           # Field management + availability
│   │   ├── home/             # Public homepage aggregated data
│   │   ├── payments/         # Midtrans webhook notifications
│   │   ├── profile/          # User profile CRUD
│   │   ├── renter/           # Renter-specific endpoints (revenue, venues, bookings)
│   │   ├── reports/          # User reports + admin reply system
│   │   ├── reviews/          # Field reviews & ratings
│   │   ├── sport-types/      # Sport type CRUD
│   │   ├── uploads/          # ImageKit file uploads (venues, fields, profiles)
│   │   ├── users/            # User management (admin)
│   │   ├── venues/           # Venue CRUD, approval/rejection workflow
│   │   ├── config/           # env.ts, midtrans.ts
│   │   ├── db/               # Prisma client singleton
│   │   ├── lib/              # imagekit.ts, mailer.ts
│   │   ├── middleware/        # auth, admin, validate, rateLimit, error, optionalAuth, permission
│   │   ├── schemas/          # Zod request validation schemas
│   │   ├── services/         # cron.service.ts (auto-complete bookings)
│   │   ├── types/            # Express augmentation (req.user)
│   │   └── utils/            # asyncHandler, errors, logger, response
│   └── prisma/
│       ├── schema.prisma     # 16 models, 5 enums
│       ├── seeds/            # 9 seed files (simulation.ts is primary)
│       └── migrations/       # 25 migrations
│
├── frontend/             # Next.js 16 App Router (port 3001)
│   └── src/
│       ├── app/              # Pages & layouts (home, bookings, admin, renter, auth...)
│       ├── components/       # shadcn/ui (28 components) + domain + shared
│       ├── hooks/            # React Query wrappers (13 hooks)
│       ├── services/         # Axios API wrappers (11 services)
│       ├── lib/              # api.ts, queryKeys.ts, utils.ts, Zod schemas
│       ├── config/           # admin-dashboard.ts, renter-dashboard.ts
│       ├── context/          # AuthContext (useAuth)
│       └── types/            # error.ts, global.d.ts
│
├── packages/shared/      # @fieldmax/shared workspace package
│   └── src/
│       ├── index.ts          # Re-exports
│       ├── schemas/auth.ts   # Shared Zod auth schemas
│       └── types/api.ts      # ApiResponse<T> interface
│
├── diagram/              # Custom draw.io MCP server
├── obsidian/Fieldmax/    # Academic thesis vault (BAB I-IV)
├── shared/               # Mermaid & XML reference files
├── wireframes/           # HTML wireframes
├── scripts/              # Support scripts
│
├── package.json          # Root workspace config
├── pnpm-workspace.yaml   # 3 packages: frontend, backend, packages/shared
├── turbo.json            # dev task config
└── AGENTS.md             # Agent guide
```

---

## 3. Technology Stack — Detailed

### 3.1 Backend (`fieldmax-backend`)

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Runtime | Node.js + Express.js 5 | `^5.1.0` | HTTP server & routing |
| Language | TypeScript | `^5.8.3` | Strong typing, ES2016 target, CommonJS |
| ORM | Prisma | `^6.11.1` | PostgreSQL ORM + migrations |
| Validation | Zod | `^3.25.76` | Request body/query/params validation |
| Auth | bcryptjs | `^3.0.2` | Password hashing |
| Session | cookie-parser | `^1.4.7` | Session cookie handling |
| Payments | midtrans-client | `^1.4.3` | Midtrans Snap payment gateway |
| CDN | imagekit | `^6.0.0` | Image upload & delivery |
| Mail | nodemailer | `^7.0.12` | SMTP email (Gmail) |
| Security | helmet + cors + express-rate-limit | latest | Security headers, CORS, rate limiting |
| Scheduling | node-cron | `^4.2.1` | Hourly booking auto-completion |
| File Upload | multer | `^2.0.1` | Multipart form parsing (memory storage) |
| Date/Time | date-fns + date-fns-tz | `^4.1.0` | Date manipulation |
| Config | dotenv + envalid | latest | Environment variable validation |
| Seeds | @faker-js/faker | `^10.2.0` | Realistic test data generation |
| Dev | nodemon + ts-node | latest | Hot reload development |

### 3.2 Frontend (`fieldmax-frontend`)

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js 16 (App Router) | `16.0.7` | SSR/CSR React framework |
| Language | TypeScript | `^5` | ESNext, bundler resolution |
| UI | React 19 | `^19.0.0` | Component library |
| Styling | Tailwind CSS v4 | `^4` | Utility-first CSS |
| Components | shadcn/ui (new-york, neutral) | latest | 28 UI components |
| Icons | lucide-react | `^0.514.0` | Icon library |
| Data Fetching | @tanstack/react-query | `^5.80.7` | Server state management |
| Tables | @tanstack/react-table | `^8.21.3` | Headless table logic |
| Forms | react-hook-form + @hookform/resolvers | `^7.57.0` / `^5.1.1` | Form state + Zod validation |
| HTTP | axios | `^1.9.0` | API client (`withCredentials: true`) |
| Theme | next-themes | `^0.4.6` | Dark/light mode |
| Charts | recharts | `^2.15.4` | Dashboard charts |
| Carousel | embla-carousel-react | `^8.6.0` | Image carousels |
| Toasts | sonner | `^2.0.5` | Toast notifications |
| Date Picker | react-day-picker | `^9.13.0` | Calendar date selection |
| File Upload | react-dropzone | `^14.3.8` | Drag & drop file upload |
| Font | @fontsource/inter | `^5.2.8` | Inter font family |

### 3.3 Shared Package (`@fieldmax/shared`)

| Category | Technology | Purpose |
|----------|-----------|---------|
| Validation | Zod `^3.24.1` | Shared auth schemas (login, register, forgot/reset password) |
| Types | TypeScript | `ApiResponse<T>` interface, user role types |

---

## 4. Database Schema (PostgreSQL + Prisma)

**Connection:** `postgresql://postgres:root@localhost:5432/fieldmax`

### 4.1 Models (16 total)

| Model | Key Fields | Relations | Notes |
|-------|-----------|-----------|-------|
| **User** | id (UUID), fullName, email (unique), password, phoneNumber (unique?), role, isVerified, createdAt | bookings, reviews, sessions, profile, venues, resetTokens, reports, reportReplies | 3 roles: USER, RENTER, ADMIN |
| **Session** | id, userId, expiresAt | user | Session-based auth (sessionId cookie) |
| **VerificationToken** | identifier, token (unique), expires | - | Composite unique [identifier, token] |
| **ResetToken** | id (UUID), token (unique), expires, userId | user (Cascade) | Password reset tokens |
| **UserProfile** | userId (PK), profilePictureUrl, bio, address, company* | user (Cascade) | Extended user profile |
| **SportType** | id (UUID), name (unique) | fields | e.g., Futsal, Basketball, Badminton |
| **Venue** | id (UUID), renterId, name, address, city, district, province, postalCode, description, status (VerificationStatus), rejectionReason | fields, schedules, photos, renter (Cascade) | DRAFT -> PENDING -> APPROVED/REJECTED workflow |
| **VenueSchedule** | id (UUID), venueId, dayOfWeek, openTime, closeTime | venue (Cascade) | Operating hours |
| **VenuePhoto** | id (UUID), venueId, url | venue | ImageKit URLs |
| **Field** | id (UUID), name, description, basePrice, sportTypeId, venueId, status (VerificationStatus), isClosed, rejectionReason | sportType, venue, photos, bookings | Nested under venue |
| **FieldPhoto** | id (UUID), fieldId, url | field | ImageKit URLs |
| **Booking** | id (UUID), fieldId, userId, bookingDate, startTime, endTime (@db.Time), totalPrice, status (BookingStatus) | field, user, review?, payment? | PENDING -> CONFIRMED -> COMPLETED or CANCELLED |
| **Payment** | id (UUID), bookingId (unique), amount, status (PaymentStatus), snapToken, paymentRedirectUrl | booking (Cascade) | Midtrans Snap integration |
| **Review** | id (UUID), rating, comment, userId, fieldId, bookingId (unique) | field, user, booking | 1 review per booking |
| **Report** | id (UUID), userId, subject, description, category, status | user, replies (Cascade) | SCAM / TECHNICAL / PAYMENT / OTHER |
| **ReportReply** | id (UUID), reportId, senderId, message | report, sender | Admin-user conversation on reports |

### 4.2 Enums (5 total)

```prisma
UserRole            -> USER | RENTER | ADMIN
BookingStatus       -> PENDING | CONFIRMED | CANCELLED | COMPLETED
PaymentStatus       -> PENDING | PAID | EXPIRED | FAILED
VerificationStatus  -> DRAFT | PENDING | APPROVED | REJECTED
ReportCategory      -> SCAM | TECHNICAL | PAYMENT | OTHER
ReportStatus        -> PENDING | RESOLVED
```

### 4.3 Key Relationships

```
User (RENTER) 1--N Venue 1--N Field 1--N Booking N--1 User (USER)
                        |                  |
                        |                  +-- Payment (1:1)
                        |                  +-- Review (1:1, unique)
                        +-- VenueSchedule (1:N)
                        +-- VenuePhoto (1:N)

User 1--N Report 1--N ReportReply N--1 User
```

---

## 5. Backend Architecture

### 5.1 Module Pattern

Every feature module follows the same pattern:

```
feature/
+-- feature.service.ts      # Business logic (Prisma queries, validation)
+-- feature.controller.ts   # HTTP handlers (request/response mapping)
+-- feature.route.ts        # Router class with Express Router
```

### 5.2 Composition Root (`backend/src/index.ts`)

Uses **manual Dependency Injection** (no DI framework):

1. Instantiate all Services (with any constructor dependencies)
2. Instantiate all Controllers (injecting services)
3. Instantiate all Routes (injecting controllers)
4. Mount all routes on Express app under /api
5. Apply global middleware (helmet, cors, rate limit, cookieParser, json)

Example dependency chain:
```
midtransSnap -> BookingsService -> PaymentsService
                                   -> BookingsController
                                   -> PaymentsController
```

### 5.3 Middleware Pipeline

| Middleware | Scope | Purpose |
|-----------|-------|---------|
| `helmet()` | Global | Security headers |
| `globalLimiter` | Global | 100 req/15min (dev bypass) |
| `cors` | Global | `localhost:3001`, credentials |
| `express.json()` | Global | JSON body parsing |
| `cookieParser()` | Global | Cookie parsing |
| `authMiddleware` | Route | Validates sessionId cookie, attaches `req.user` |
| `optionalAuth` | Route | Same as auth but proceeds if no session (guest) |
| `adminOnlyMiddleware` | Route | Checks `req.user.role === "ADMIN"` |
| `renterOnlyMiddleware` | Route | Checks `req.user.role === "RENTER"` |
| `canManageVenue` | Route | Admin OR venue owner (RENTER) |
| `canManageField` | Route | Admin OR field''s venue owner |
| `isVenueOwner` | Route | Strictly RENTER who owns venue |
| `validateRequest` | Route | Zod validation of body/query/params |
| `authLimiter` | Route | 50 req/15min (dev bypass) |
| `errorMiddleware` | Global | Catches all errors, formats ApiResponse |
| `multer` | Route | Memory storage for file uploads |

### 5.4 Utility Layer

| Utility | Location | Purpose |
|---------|----------|---------|
| `asyncHandler` | `utils/asyncHandler.ts` | Wraps async route handlers to catch errors -> `next(err)` |
| `sendSuccess` / `sendError` | `utils/response.ts` | Standardized `ApiResponse<T>` JSON responses |
| `CustomError` hierarchy | `utils/errors.ts` | `NotFoundError`(404), `ConflictError`(409), `UnauthorizedError`(401), `ForbiddenError`(403), `ValidationError`(400) |
| `logger` | `utils/logger.ts` | Simple console-based logger with levels |
| `config` | `config/env.ts` | envalid-validated env vars |

### 5.5 API Routes Summary

All routes mounted under `/api`:

| Module | Base Path | Key Endpoints | Auth |
|--------|-----------|---------------|------|
| **Auth** | `/api/auth` | register, login, logout, me, verify, resend-code, forgot-password, reset-password | Mixed |
| **Users** | `/api/users` | CRUD + bulk delete | Admin |
| **Sport Types** | `/api/sport-types` | CRUD | Admin |
| **Venues** | `/api/venues` | CRUD, approve/reject/submit, public list | Mixed |
| **Fields** | `/api/fields` | CRUD, availability, toggle closure | Mixed |
| **Bookings** | `/api/bookings` | CRUD, confirm/cancel | Authenticated |
| **Payments** | `/api/payments` | Midtrans notification webhook | Public |
| **Profile** | `/api/profile` | Update profile | Authenticated |
| **Renter** | `/api/renter` | My venues/fields/bookings, revenue stats, public profile | Renter |
| **Dashboard** | `/api/dashboard` | Admin & renter stats, chart data | Authenticated |
| **Reviews** | `/api/reviews` | Create review, get by field | Authenticated |
| **Reports** | `/api/reports` | CRUD, reply, resolve | Authenticated |
| **Home** | `/api/home` | Landing page aggregated data | Public |
| **Uploads** | `/api/uploads` | Upload photos (venue, field, profile) | Authenticated + permission |

### 5.6 Cron Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| Booking completion | Every hour (`0 * * * *`) | Updates `CONFIRMED` bookings with `endTime < now` to `COMPLETED` |

### 5.7 Authentication Flow

1. **Register** -> Create user + verification token -> Send 6-digit code email
2. **Verify Email** -> Validate code -> Set `isVerified = true`
3. **Login** -> Validate credentials + verified check -> Create session (UUID) -> Set `sessionId` HttpOnly cookie
4. **Session Check** -> `authMiddleware` reads cookie -> Finds session in DB -> Attaches `req.user`
5. **Logout** -> Delete session from DB -> Clear cookie

### 5.8 Booking Flow

1. User selects field + date + time slot -> Backend checks availability (no overlapping bookings)
2. Create `Booking` (PENDING) + `Payment` (PENDING) -> Generate Midtrans Snap token
3. User pays via Midtrans Snap popup
4. Midtrans sends webhook notification -> `PaymentsService.handleMidtransNotification()` -> Update booking + payment status
5. Cron job auto-completes bookings when time passes

---

## 6. Frontend Architecture

### 6.1 Page Structure (App Router)

| Route Group | Path | Auth Required | Description |
|-------------|------|---------------|-------------|
| `(home)` | `/` | No | Landing page (hero, featured fields/venues, stats, CTA) |
| Auth | `/login`, `/register`, `/register/renter`, `/forgot-password`, `/reset-password`, `/verify-email` | No | Authentication pages |
| Public | `/fields`, `/fields/[fieldId]`, `/venues`, `/venues/[venueId]`, `/search`, `/renters/[id]` | No | Browsing |
| Public | `/about`, `/faq`, `/pricing`, `/privacy`, `/terms` | No | Static pages |
| User | `/bookings`, `/bookings/[bookingId]`, `/profile`, `/reports`, `/reports/[id]` | Yes | User dashboard |
| **Admin** | `/admin/*` (dashboard, users, sport-types, venues, fields, bookings, reports) | ADMIN | Admin console |
| **Renter** | `/renter/*` (dashboard, venues, fields, bookings, revenue, reports) | RENTER | Renter console |

### 6.2 Data Fetching Pattern

```
Page/Component
    | uses
    v
React Query Hook (hooks/use*.ts)
    | calls
    v
Service (services/*.service.ts)
    | axios
    v
Backend API (/api/*)
```

**Key conventions:**
- Never call Axios directly in pages/components
- All data fetching goes through React Query hooks
- Hooks use query keys from `lib/queryKeys.ts`
- Mutations invalidate relevant query keys on success
- Error handling: Axios interceptors + toast notifications (sonner)
- Zod validation on client-side response data via `*.parse()`

### 6.3 Component Hierarchy

```
RootLayout (app/layout.tsx)
+-- ThemeProvider (next-themes)
    +-- QueryProvider (@tanstack/react-query)
        +-- AuthProvider (AuthContext)
            +-- NavbarWrapper (conditional: hides on login/register/admin/renter/search)
            |   +-- Navbar (public nav: logo, fields, venues, bookings, login/register)
            +-- <main> {children} </main>
            +-- Footer
        +-- ModeToggle (fixed dark/light toggle)
        +-- Toaster (sonner)

AdminLayout (/admin/layout.tsx)
+-- AuthGuard -> RoleGuard("ADMIN") -> SidebarProvider
    +-- AdminSidebar (adminNavItems config)
    +-- Header
    +-- <main> {children} </main>

RenterLayout (/renter/layout.tsx)
+-- AuthGuard -> RoleGuard("RENTER") -> SidebarProvider
    +-- RenterSidebar (renterNavItems config)
    +-- Header
    +-- <main> {children} </main>
```

### 6.4 shadcn/ui Components (28)

`accordion`, `alert-dialog`, `avatar`, `badge`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `command`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `popover`, `progress`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `sonner`, `stepper`, `switch`, `table`, `tabs`, `textarea`, `tooltip`

Style: **new-york** variant, **neutral** base color, CSS variables, lucide-react icons.

### 6.5 Shared Components

| Component | Purpose |
|-----------|---------|
| `DataTable` | Generic Tanstack Table with pagination, sorting, search, row selection, bulk delete |
| `AppSidebar` | Reusable sidebar for both Admin and Renter with nav items + user profile dropdown |
| `ConfirmationDialog` | Reusable delete/action confirmation modal |
| `ImageUploader` | Drag-and-drop file upload (react-dropzone) |
| `MediaCarousel` | Image carousel for venue/field photos |
| `FieldCard` | Field display card with photo, sport type, price, rating |
| `VenueCard` | Venue display card |
| `ReviewDialog` / `ReviewList` / `StarRating` | Review UI components |
| `BookingModal` | Booking creation modal with date/time picker |
| `AuthGuard` / `RoleGuard` | Route protection components |
| `FullScreenLoader` | Full-screen loading spinner |

### 6.6 Dashboard Configs

**Admin sidebar** (`config/admin-dashboard.ts`): Dashboard, Users, Sport Types, Venues, Fields, Bookings, Reports

**Renter sidebar** (`config/renter-dashboard.ts`): Dashboard, My Venues, My Fields, Bookings, Revenue, Support

### 6.7 Utility Functions (`lib/utils.ts`)

- `cn()` - Tailwind class merge (clsx + tailwind-merge)
- `formatCurrency()` / `formatPrice()` - IDR currency formatting
- `formatDate()` / `formatTime()` - Date/time display

---

## 7. Shared Package (`@fieldmax/shared`)

### 7.1 Schema Exports (`schemas/auth.ts`)

- `UserRole`, `UserRoleType`, `userRoleSchema` - User role enums
- `loginSchema` / `LoginInput` - Email + password
- `registerSchema` / `RegisterInput` - fullName, email, password, confirmPassword, role
- `forgotPasswordSchema` / `ForgotPasswordInput` - Email only
- `resetPasswordSchema` / `ResetPasswordInput` - token, password, confirmPassword
- `resetPasswordFormSchema` / `ResetPasswordFormInput` - Omits token for frontend form

### 7.2 Type Exports (`types/api.ts`)

```typescript
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    meta?: { page?, limit?, total?, totalPages?, [key: string]: any };
    error?: { code: string; message: string; details?: any };
}
```

This is the standardized envelope for all backend responses.

---

## 8. Key Workflows

### 8.1 Venue Approval Workflow

```
RENTER creates venue (DRAFT)
    |
RENTER uploads photos (min 2 required)
    |
RENTER submits venue (DRAFT -> PENDING)
    |
ADMIN reviews
    +-- Approve (PENDING -> APPROVED) -> venue becomes publicly visible
    +-- Reject (PENDING -> REJECTED) -> with rejectionReason
            |
        RENTER can resubmit (REJECTED -> PENDING)
```

### 8.2 Field Management

- Fields are nested under Venues
- Same DRAFT -> PENDING -> APPROVED/REJECTED workflow as venues
- `isClosed` toggle for temporary closure
- `basePrice` per hour
- Availability checking prevents double-booking

### 8.3 Report System

```
USER creates Report (subject, description, category)
    |
ADMIN views and replies via ReportReply
    | (optional: both sides can reply)
    |
ADMIN marks as RESOLVED
```

---

## 9. Environment Configuration

### Backend (`backend/.env`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://postgres:root@localhost:5432/fieldmax` |
| `DIRECT_URL` | Direct DB connection | Same as above |
| `PORT` | Server port | `3000` (default) |
| `NODE_ENV` | Environment | `development` |
| `BACKEND_URL` | Backend base URL | `http://localhost:3000` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:3001` |
| `SESSION_EXPIRES_IN_MS` | Session TTL | `86400000` (24h) |
| `MIDTRANS_SERVER_KEY` | Midtrans server key | `SB-Mid-server-...` |
| `MIDTRANS_CLIENT_KEY` | Midtrans client key | `SB-Mid-client-...` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | `public_...` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | `private_...` |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL | `https://ik.imagekit.io/ztzrk/` |
| `SMTP_USER` | Gmail address | `fieldmax.ofc@gmail.com` |
| `SMTP_PASS` | Gmail app password | App-specific password |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests/window | `100` |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | Auth max requests/window | `50` |
| `VERIFICATION_CODE_EXPIRES_IN_MS` | Code TTL | `900000` (15min) |
| `RESET_TOKEN_EXPIRES_IN_MS` | Reset token TTL | `3600000` (1h) |

### Frontend (`frontend/.env`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Midtrans client key for Snap popup |

---

## 10. Seed Strategy

The primary seeder is `prisma/seeds/simulation.ts` which generates realistic test data:

- **Size tiers**: Pre-configured data sizes (default: LARGE in `seed.ts`)
- **Users**: Creates users, renters, and an admin account
- **Sport Types**: Creates standard Indonesian sports (Futsal, Badminton, Basketball, etc.)
- **Venues & Fields**: Generates venues with schedules, photos, and fields per sport type
- **Bookings & Payments**: Creates realistic booking history with payments
- **Reviews**: Generates reviews for completed bookings

Run with: `pnpm seed:sim` (or `pnpm seed:main` which delegates to it)

---

## 11. Dev Commands

```bash
# From root
pnpm dev                    # Run frontend + backend concurrently (Turborepo)

# Backend
cd backend && pnpm dev      # nodemon + ts-node on port 3000
cd backend && npx prisma migrate dev    # Create DB migration
cd backend && npx prisma db seed       # Run seeders
cd backend && npx prisma studio        # DB GUI

# Frontend
cd frontend && pnpm dev     # Next.js on port 3001
cd frontend && pnpm build   # Production build

# Shared
cd packages/shared && pnpm build   # Compile TypeScript

# Diagram (MCP server)
cd diagram && npm start     # HTTP server on port 3001
```

---

## 12. Code Quality & Conventions

| Convention | Detail |
|-----------|--------|
| **Indentation** | 4 spaces |
| **Brace style** | Allman (newline braces) in diagram MCP; standard JS in app code |
| **TypeScript** | Strict mode everywhere, `noImplicitAny: true` |
| **Error handling** | Backend: typed CustomError subclasses + asyncHandler wrapper; Frontend: Axios error toast messages |
| **No raw SQL** | All DB queries through Prisma ORM |
| **No `any`** | Avoid `any`; use proper types |
| **Validation** | Zod on both backend (middleware) and frontend (parse API responses) |
| **File naming** | kebab-case for files, PascalCase for classes/components |
| **API response envelope** | All responses use `ApiResponse<T>` from `@fieldmax/shared` |

---

## 13. Known Limitations / Areas for Improvement

1. **Photo deletion from ImageKit**: `venues.service.ts` `deletePhoto()` only removes from DB - ImageKit cleanup is commented as TODO
2. **No JWT**: Session-based auth only (works for monolith but not for microservices)
3. **Rate limiting bypassed in dev**: `limiterOrNext()` skips rate limit in non-production
4. **Email transporter closes after each send**: In `mailer.ts`, `transporter.close()` is called in finally block, which may cause issues with connection pooling
5. **No test suite**: No unit or integration tests visible in the codebase
6. **CORS hardcoded**: CORS origin is hardcoded to `localhost:3001`
7. **Dual validation middleware**: Both `validate.middleware.ts` (new) and `validation.middleware.ts` (legacy) exist
8. **Supabase URL in next.config.ts**: Image remote patterns reference a Supabase URL - likely legacy from previous CDN

---

## 14. Git History Highlights

The project has evolved through ~30 commits on `main`:
- Initial schema setup with Prisma migrations
- UUID migration for all primary keys
- Session-based auth implementation
- Midtrans payment integration
- ImageKit upload migration
- Venue approval workflow (DRAFT -> PENDING -> APPROVED/REJECTED)
- Review system with booking relation
- Report system with admin reply
- Dashboard charts with revenue aggregation
- Wireframes and documentation
- Diagram MCP server initialization
- Academic thesis documentation

---

## 15. Project Diagram (Architecture Overview)

```
CLIENT (Browser)
Next.js 16 App Router (port 3001)
React 19 + Tailwind CSS v4 + shadcn/ui + React Query
    Public Pages         User Pages           Admin / Renter Dashboards
    (SEO, browse)       (bookings, profile,   (managements, reports,
                          reviews)             revenue charts)
         |                    |                        |
         +--------------------+------------------------+
                              | axios (withCredentials: true)
                              |
                    EXPRESS API (port 3000)
    Middleware: helmet -> rateLimit -> cors -> json -> cookie
               auth -> validate -> controller -> errorMiddleware

    Auth        Venues       Fields      Bookings
    (session)   (CRUD,       (CRUD,      (CRUD, avail,
                 approve)     close)      Midtrans)

    Payments    Dashboard    Reviews     Reports
    (webhook)   (stats,      (rating)    (user support)
                 charts)

    External Services:
    Midtrans      ImageKit      Nodemailer (SMTP)
    (payments)    (CDN)         (email verification, password reset)

                    PostgreSQL
                    (Prisma ORM)
                    16 tables
```

---

*Analysis generated on 2026-07-17 based on commit `5693c61`.*
