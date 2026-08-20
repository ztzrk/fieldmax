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
- `images/`: Research figures (`.drawio` + `.svg` + `.png`)
- `Proposal Skripsi - BAB I dan BAB II (Audited).md`: Full unified audited proposal document.
- `convert_proposal_to_docx.py`: Python conversion script to Word DOCX.

Use the `obsidian` MCP server to read/write vault files.

---

## 🎓 Pedoman Penulisan Tugas Akhir Mahasiswa Universitas Hasanuddin (2023)
*Sumber: Lampiran Keputusan Rektor Universitas Hasanuddin No: 10438/UN4.1/KEP/2023*

When writing, auditing, formatting, or converting academic thesis files (*skripsi/proposal*) in `obsidian/Fieldmax/`, AI agents MUST ALWAYS adhere to these official Unhas rules:

### 1. Struktur & Sistematika Penulisan
- **Tanpa Bab Tinjauan Pustaka Terpisah**: Tidak ada bab Tinjauan Pustaka tersendiri. Landasan teori dan kajian literatur dielaborasi langsung ke dalam **BAB I (Pendahuluan)** pada subbab `1.1 Latar Belakang` dan `1.6 Landasan Teori`.
- **Struktur Skripsi Standar**:
  - **Bagian Awal (*Front-Matter*)**: Halaman Judul, Halaman Pengajuan, Halaman Pengesahan, Pernyataan Keaslian & Pelimpahan Hak Cipta, Ucapan Terima Kasih, Abstrak (Bahasa Indonesia), Abstract (Bahasa Inggris), Daftar Isi, Daftar Tabel, Daftar Gambar, Daftar Lampiran, Daftar Singkatan/Istilah.
  - **Bagian Utama**:
    - **BAB I: PENDAHULUAN** (Latar Belakang, Rumusan Masalah, Tujuan Penelitian, Batasan Masalah, Manfaat Penelitian, Landasan Teori).
    - **BAB II: METODE PENELITIAN** (Waktu & Lokasi, Kerangka DSR, Metode Pengumpulan Data, Metode Pengembangan Waterfall SDLC, Tahapan Penelitian, Analisis Sistem, Perancangan UML, Desain UI).
    - **BAB III: HASIL DAN PEMBAHASAN** (Implementasi Sistem & Basis Data, Activity Diagram, Implementasi UI/UX, Pengujian Black Box Testing, Pembahasan Hasil Penelitian).
    - **BAB IV: KESIMPULAN DAN SARAN** (Kesimpulan menjawab rumusan masalah secara lugas, Saran pengembangan).
  - **Bagian Akhir**: Daftar Pustaka (APA Style 7th Edition / Harvard), Lampiran.

### 2. Tipografi & Tata Letak Naskah
- **Ukuran Kertas**: **B5 (176 mm x 250 mm)** format buku standar Unhas (atau A4 jika diminta secara khusus).
- **Margin (Batas Sembir)**: **2,25 cm** merata pada seluruh sisi (Atas, Bawah, Kiri, Kanan).
- **Jenis Font**: **Arial** di seluruh bagian naskah skripsi.
- **Ukuran Huruf**:
  - Judul Bab (`BAB I`, `BAB II`): **11 pt Tebal (Bold), Huruf Kapital, Rata Tengah (Centered)**.
  - Subjudul (`1.1`, `2.1`): **10 pt Tebal (Bold), Title Case, Rata Kiri**.
  - Anak-subjudul (`1.6.1`, `2.4.1`): **10 pt Tebal (Bold), Rata Kiri**.
  - Teks Isi / Paragraf: **10 pt Reguler, Rata Kiri-Kanan (Justified)**.
- **Spasi & Jarak**:
  - Teks utama skripsi: **Spasi 1,15**.
  - Spasi **1,0 (Single)** untuk: Abstrak, kutipan langsung, judul tabel, judul gambar, isi tabel, daftar isi/tabel/gambar, dan daftar pustaka.
- **Indentasi Paragraf**:
  - Awal paragraf menggunakan indentasi **1,25 cm** (ketukan ke-5).
  - **Pengecualian**: Paragraf pertama tepat setelah Subjudul dimulai **tanpa indentasi (rata kiri)**, indentasi berlaku pada paragraf kedua dan seterusnya.

### 3. Ketentuan Ilustrasi: Tabel & Gambar
- **Tabel**:
  - Judul tabel diletakkan di **ATAS tabel**, rata kiri, spasi 1.0, font Arial 10 pt.
  - Format penamaan: `Tabel [Nomor]. [Judul Tabel]` **tanpa diakhiri tanda titik**.
  - Nomor tabel berlanjut dari nomor urut 1 sampai selesai di seluruh skripsi (misal `Tabel 1.`, `Tabel 2.`, ... `Tabel 27.`).
  - Garis tabel bergaya akademik bersih (garis horizontal atas, bawah header, dan bawah tabel).
- **Gambar**:
  - Gambar diletakkan di posisi **Rata Tengah (Centered)**.
  - Judul gambar diletakkan di **BAWAH gambar**, rata tengah/justified, spasi 1.0, font Arial 10 pt.
  - Format penamaan: `Gambar [Nomor]. [Judul Gambar]` **tanpa diakhiri tanda titik**.
  - Nomor gambar berlanjut dari nomor urut 1 sampai selesai (misal `Gambar 1.`, `Gambar 2.`, ... `Gambar 67.`).

### 4. Kaidah Sitasi & Daftar Pustaka
- Menggunakan sistem **Harvard / APA Style** (`Author, Year`).
- Penulisan et al.: Gunakan **et al.** (dengan titik di akhir, tidak dicetak miring), bukan dkk.
- Daftar Pustaka diurutkan secara alfabetis (A-Z) berdasarkan nama belakang/keluarga penulis pertama, spasi 1.0 dengan *hanging indent*.

### 5. Abstrak & Abstract
- Ditulis dalam **1 paragraf utuh** yang padat, maksimum **250 kata** untuk skripsi.
- Memuat alur: *Latar belakang $\rightarrow$ Tujuan $\rightarrow$ Metode $\rightarrow$ Hasil $\rightarrow$ Kesimpulan*.
- Kata Kunci (*Keywords*): Maksimum **6 kata kunci**, dipisahkan oleh tanda titik koma (`;`), tidak mengulang kata persis yang ada di judul utama.

---

## ⚠️ Important Rules

1. **Always use pnpm** — never npm or yarn
2. **Read schema.prisma** before any database work
3. **Follow existing patterns** — check similar controllers/services/hooks first
4. **Don't break Prisma relations** when refactoring
5. **Bahasa Indonesia** for user-facing text and thesis writing, **English** for code/comments
6. **Frontend on port 3001** — the diagram MCP HTTP mode also uses 3001
7. **Backend uses nodemon + ts-node** for dev, not a fixed port (configured in index.ts)
8. **Follow Unhas 2023 Guidelines** for all thesis writing, formatting, and document conversions.

