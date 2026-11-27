# FieldMax Design System (`frontend/DESIGN.md`)

Panduan desain UI/UX resmi untuk aplikasi web FieldMax (marketplace sewa lapangan olahraga di Indonesia).

## 1. Tech Stack & Primitive UI
- **Framework**: Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling**: Tailwind CSS v4 (`frontend/src/app/globals.css`)
- **Component Library**: `shadcn/ui` (`style: "new-york"`, `baseColor: "neutral"`, `iconLibrary: "lucide"`)
- **Config**: `frontend/components.json`

## 2. Design Tokens (Sumber: `src/app/globals.css`)
- **Primary Brand Color**: `--primary` (`oklch(0.6397 0.1720 36.4421)` — oranye hangat / terracotta) dengan `--primary-foreground` putih (`oklch(1 0 0)`).
- **Surface & Background**:
  - Light mode: `--background` (`oklch(0.9383 0.0042 236.4993)`), `--card` (`oklch(1 0 0)`), `--border` (`oklch(0.9022 0.0052 247.8822)`).
  - Dark mode (`.dark`): `--background` (`oklch(0.2598 0.0306 262.6666)`), `--card` (`oklch(0.3106 0.0301 268.6365)`), `--border` (`oklch(0.3843 0.0301 269.7337)`).
- **Selalu gunakan semantic tokens** (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-primary`) daripada warna hardcoded (`bg-white`, `text-slate-900`, `#000000`) agar light & dark mode tetap konsisten dan kontras terjaga.
- **Border Radius**: Base `--radius: 0.75rem` (`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`).

## 3. Tipografi & Hierarki
- **Font Utama**: `Inter` (`@fontsource/inter`, `--font-sans`), `JetBrains Mono` untuk angka/kode (`--font-mono`).
- **Angka Harga & Statistik**: Gunakan `tabular-nums` pada tampilan harga (`Rp ...`), jam booking, dan angka metrik agar sejajar rapi di kartu dan tabel.
- **Hierarki Konsisten**:
  - Hero `h1`: `text-3xl sm:text-5xl md:text-6xl font-bold/extrabold tracking-tight`
  - Section `h2`: `text-2xl md:text-3xl font-bold tracking-tight`
  - Subjudul / deskripsi section: `text-sm md:text-base text-muted-foreground`
- **Bahasa**: Seluruh teks antarmuka pengguna wajib dalam **Bahasa Indonesia** yang natural dan ringkas.

## 4. Layout, Spacing, & Responsivitas
- **Container**: Gunakan lebar maksimum yang konsisten (`max-w-[1400px] mx-auto px-4 md:px-6` atau `container mx-auto px-4 md:px-6`).
- **Spacing Scale**: Gunakan kelipatan `4px` (`gap-2`, `gap-4`, `gap-6`, `p-4`, `p-6`, `py-10`/`py-16`/`py-20`).
- **Mobile-First**: Pastikan tidak ada horizontal overflow pada `375px`, target sentuh tombol/chip minimal `36px–44px` (`h-9` / `h-10`), dan navigasi/filter tetap nyaman di layar kecil.

## 5. Kualitas Interaksi, Aksesibilitas & Anti-Pattern
- **State Lengkap**: Setiap halaman dan komponen data wajib menangani `loading` (`Skeleton`), `error`, dan `empty` state dengan pesan Bahasa Indonesia yang jelas.
- **Aksesibilitas**:
  - Pertahankan `focus-visible:ring-2` pada seluruh elemen interaktif.
  - Gunakan `<button>` / `<Link>` semantik (hindari `<div>` klik tanpa `role`/`tabIndex`/keyboard handler untuk elemen navigasi atau aksi).
  - Pastikan kontras teks minimal WCAG AA (`4.5:1` teks normal, `3:1` teks besar) di light maupun dark mode.
- **Hindari "AI Slop"**:
  - Jangan gunakan *gradient text* dekoratif (`bg-clip-text text-transparent`) pada heading/metrik.
  - Hindari efek gerak berlebihan yang mengganggu keterbacaan (seperti *3D card tilt* atau *scale-105/110* agresif pada container besar).
  - Hindari class Tailwind tidak valid atau custom animasi yang tidak terdefinisi di `globals.css`.

## 6. Alur Kerja Desain & Verifikasi
1. **Referensi Pola**: Gunakan **Mobbin** (`search_screens` / `search_sections` / `redesign-screen`) untuk mencari pola UI produksi yang terbukti (kartu venue, filter pencarian, slot booking, dashboard).
2. **Komponen**: Gunakan **shadcn MCP** (`search_items_in_registries`, `get_item_examples_from_registries`) sebelum membuat primitive UI baru.
3. **Verifikasi Visual**: Jalankan dev server (`pnpm dev` di port `3001`) lalu gunakan **Playwright MCP** untuk memeriksa tampilan desktop (`1280x720`) dan mobile (`375x812`), dark/light mode, serta console errors.
4. **Audit**: Jalankan `npx impeccable detect frontend/src` (atau pada `http://localhost:3001`) dan ikuti skill `web-design-guidelines`.
