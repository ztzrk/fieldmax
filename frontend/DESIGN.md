---
name: "FieldMax Design System"
version: "2.0.0"
framework:
  ui: "shadcn/ui (new-york, neutral, lucide)"
  css: "Tailwind CSS v4 (CSS-first, src/app/globals.css)"
tokens:
  colors:
    light:
      background: "oklch(0.9680 0.0030 240.0000)"
      foreground: "oklch(0.2400 0.0150 255.0000)"
      card: "oklch(1.0000 0 0)"
      primary: "oklch(0.5550 0.1780 36.4421)"
      primaryForeground: "oklch(1.0000 0 0)"
      mutedForeground: "oklch(0.4750 0.0230 264.3637)"
      destructive: "oklch(0.5550 0.2150 25.3313)"
      border: "oklch(0.8950 0.0060 247.8822)"
    dark:
      background: "oklch(0.2100 0.0280 263.0000)"
      foreground: "oklch(0.9400 0.0050 250.0000)"
      card: "oklch(0.2600 0.0280 268.0000)"
      primary: "oklch(0.7350 0.1650 38.0000)"
      primaryForeground: "oklch(0.1600 0.0200 36.0000)"
      mutedForeground: "oklch(0.7400 0.0120 264.0000)"
      destructive: "oklch(0.6800 0.1900 25.0000)"
      border: "oklch(0.3650 0.0280 269.7337)"
    status:
      success: "var(--status-success)"
      warning: "var(--status-warning)"
      info: "var(--status-info)"
      destructive: "var(--destructive)"
  typography:
    fontFamily:
      sans: "Inter, sans-serif"
      mono: "JetBrains Mono, monospace"
    scale:
      heroH1: "text-3xl sm:text-5xl md:text-6xl font-bold/extrabold tracking-tight"
      sectionH2: "text-2xl md:text-3xl font-bold tracking-tight"
      cardTitle: "text-base md:text-lg font-semibold"
      body: "text-sm md:text-base leading-relaxed"
      numeric: "tabular-nums"
  spacing:
    gridUnit: "4px (0.25rem)"
    containerMax: "1400px"
    pagePadding: "px-4 md:px-6"
    touchTargetMin: "36px-44px (h-9 / h-10)"
  radii:
    base: "0.75rem"
    cards: "rounded-xl (12px) - rounded-2xl (16px)"
    controls: "rounded-md / rounded-lg, pills only for small chips"
  zIndex:
    stickyHeader: "z-40"
    dropdownPopover: "z-50"
    floatingControls: "z-50"
    modalSheet: "z-50 (Radix Portal)"
  accessibility:
    wcag: "WCAG 2.2 AA (>= 4.5:1 normal text, >= 3:1 large text & UI borders)"
    focusRing: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    reducedMotion: "prefers-reduced-motion respected globally + motion-reduce:"
---

# FieldMax Design System (`frontend/DESIGN.md`)

Panduan desain UI/UX resmi untuk aplikasi web **FieldMax** (marketplace sewa lapangan olahraga di Indonesia dengan 3 portal utama: **User**, **Renter**, dan **Admin**).

## 1. Filosofi & Mode Permukaan
- **Halaman Publik (`(home)`, `about`, `pricing`, `fields`, `venues`) — Mode *Persuade***: Berorientasi pada pencarian cepat, kepercayaan tempat olahraga terverifikasi, dan konversi sewa lapangan.
- **Portal Operasional (`bookings`, `profile`, `renter/*`, `admin/*`) — Mode *Operate***: Prioritaskan keterbacaan tabel/jadwal, konsistensi status, kepadatan informasi yang rapi, dan pencegahan kesalahan aksi.

## 2. Token Warna & Kontras (WCAG 2.2 AA)
- **Wajib Semantic Tokens**: Gunakan `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary`, `text-primary-foreground` dari `src/app/globals.css`.
- **Aturan Kontras**:
  - Nilai OKLCH di `globals.css` sudah dikalibrasi agar teks normal (`primary-foreground` di atas `primary`, `text-primary` di atas `card`/`background`, `muted-foreground` di atas `background`) memenuhi rasio **>= 4.5:1** di mode terang maupun gelap.
  - **Marketing Hero / Banner Oranye**: Karena `--primary` pada mode gelap dibuat lebih terang (`L = 0.735`) untuk menjaga keterbacaan `text-primary` di atas kartu gelap, banner penuh berwarna oranye dengan teks putih wajib memakai gradasi gelap eksplisit (`from-orange-700 via-orange-600 to-amber-700 text-white`) alih-alih `bg-primary` mentah.
- **Status Domain Tokens**:
  - **Tersedia / Disetujui / Lunas (`APPROVED`, `PAID`, `COMPLETED`)**: gunakan `--status-success` (`text-status-success` / `bg-status-success/10 border-status-success/25`).
  - **Menunggu / Pending (`PENDING`)**: gunakan `--status-warning`.
  - **Informasi / Sedang Berjalan**: gunakan `--status-info`.
  - **Ditolak / Dibatalkan / Tutup (`REJECTED`, `CANCELLED`, `CLOSED`)**: gunakan `--destructive`.

## 3. Tipografi, Angka & Lokalisasi
- **Font**: `Inter` (`--font-sans`) untuk antarmuka, `JetBrains Mono` (`--font-mono`) untuk kode/ID transaksi/QR code.
- **Angka & Harga**: Semua nominal Rupiah (`Rp ...`), jam booking (`08:00 - 10:00`), rating, dan angka statistik wajib memakai `tabular-nums`.
- **Bahasa**: Seluruh label UI, tombol, placeholder, pesan validasi form, toast, dan empty state wajib berbahasa **Bahasa Indonesia** yang ringkas dan natural (termasuk `ModeToggle`, tooltip, dan `aria-label`).

## 4. Pola Komponen per Konteks
- **Kartu Katalog (`FieldCard`, `VenueCard`)**:
  - Jangan menumpuk elemen interaktif (`<Button>` di dalam `<Link>`).
  - Jangan menyembunyikan harga, rating, atau lokasi di balik state `:hover` (tidak ramah perangkat sentuh).
- **Form & Validasi**:
  - Gunakan `shadcn` Form + `react-hook-form` + `@fieldmax/shared` Zod schema.
  - Label selalu terlihat di atas input (jangan menggantikan label dengan `placeholder`), tampilkan pesan error spesifik di bawah field, dan nonaktifkan tombol submit dengan indikator loading saat mutasi berjalan.
- **Tabel & Dashboard (`admin/*`, `renter/*`)**:
  - Bungkus tabel lebar dengan kontainer `overflow-x-auto` agar tidak memicu horizontal overflow di layar kecil.
  - Grafik `recharts` wajib memakai token `--chart-1` hingga `--chart-5` agar otomatis beradaptasi di light dan dark mode.
- **Dialog, Sheet & Toast**:
  - Gunakan `AlertDialog` untuk aksi destruktif (hapus lapangan/venue, batalkan pesanan, tolak pengajuan).
  - Gunakan `sonner` toast untuk umpan balik aksi singkat dengan kalimat aktif berbahasa Indonesia.

## 5. Layout, Aksesibilitas & Motion
- **Responsif & Tanpa Overflow**: Uji selalu pada `375x812` (mobile) dan `1280x720` (desktop). Hindari lebar fixed besar seperti `w-96` tanpa `w-full max-w-96`.
- **Semantik & Fokus**: Gunakan `<button>`, `<Link>`, dan `<label>` asli. Wajibkan `focus-visible:ring-2` serta `aria-label` pada tombol ikon saja.
- **Motion & `prefers-reduced-motion`**:
  - Utamakan transisi halus (`150ms–250ms` untuk hover/state), hindari 3D tilt atau `scale-105/110` agresif pada kontainer teks besar.
  - `globals.css` sudah menyertakan fallback global `@media (prefers-reduced-motion: reduce)`; tetap tambahkan `motion-reduce:transition-none` / `motion-reduce:transform-none` pada animasi custom komponen.
- **Anti-Pattern ("AI Slop")**: Dilarang menggunakan *gradient text* (`bg-clip-text text-transparent`), animasi dekoratif yang belum didefinisikan, atau warna hardcoded `#000000` / `bg-white` pada komponen konten umum.

## 6. Alur Kerja Desain & Verifikasi
1. **Referensi Pola**: Gunakan **Mobbin** (`search_screens`, `search_sections`, `redesign-screen`) untuk pola UI produksi nyata.
2. **Komponen**: Gunakan **shadcn MCP** (`search_items_in_registries`, `get_item_examples_from_registries`, `get_audit_checklist`) sebelum membuat komponen baru.
3. **Audit Otomatis**: Jalankan `pnpm --filter fieldmax-frontend design:audit` (atau `npx impeccable detect src`).
4. **Verifikasi Browser**: Periksa hasil render pada `http://localhost:3001` via **Playwright MCP** untuk viewport desktop (`1280x720`) & mobile (`375x812`), mode terang & gelap, serta bebas console error.
