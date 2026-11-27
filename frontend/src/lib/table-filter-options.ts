import type { FacetedFilterOption } from "@/components/shared/DataTableFacetedFilter";

export const BOOKING_STATUS_OPTIONS: FacetedFilterOption[] = [
    { value: "PENDING", label: "Menunggu" },
    { value: "CONFIRMED", label: "Dikonfirmasi" },
    { value: "COMPLETED", label: "Selesai" },
    { value: "CANCELLED", label: "Dibatalkan" },
    { value: "NO_SHOW", label: "Tidak Hadir" },
];

export const PAYMENT_STATUS_OPTIONS: FacetedFilterOption[] = [
    { value: "PAID", label: "Lunas" },
    { value: "PENDING", label: "Menunggu Pembayaran" },
    { value: "EXPIRED", label: "Kedaluwarsa" },
    { value: "FAILED", label: "Gagal" },
];

export const VENUE_STATUS_OPTIONS: FacetedFilterOption[] = [
    { value: "DRAFT", label: "Draf" },
    { value: "PENDING", label: "Menunggu Verifikasi" },
    { value: "APPROVED", label: "Disetujui" },
    { value: "REJECTED", label: "Ditolak" },
];

export const FIELD_STATUS_OPTIONS: FacetedFilterOption[] = [
    { value: "PENDING", label: "Menunggu Verifikasi" },
    { value: "APPROVED", label: "Disetujui" },
    { value: "REJECTED", label: "Ditolak" },
];

export const AVAILABILITY_OPTIONS: FacetedFilterOption[] = [
    { value: "false", label: "Buka" },
    { value: "true", label: "Tutup" },
];

export const USER_ROLE_OPTIONS: FacetedFilterOption[] = [
    { value: "USER", label: "Pengguna" },
    { value: "RENTER", label: "Mitra" },
    { value: "ADMIN", label: "Admin" },
];

export const USER_VERIFIED_OPTIONS: FacetedFilterOption[] = [
    { value: "true", label: "Terverifikasi" },
    { value: "false", label: "Belum Verifikasi" },
];

export const BOOKING_COLUMN_LABELS: Record<string, string> = {
    id: "ID Pemesanan",
    user: "Pengguna",
    venue_field: "Tempat & Lapangan",
    bookingDate: "Tanggal & Waktu",
    status: "Status",
    checkedInAt: "Kehadiran",
    paymentStatus: "Pembayaran",
    totalPrice: "Total",
};

export const VENUE_COLUMN_LABELS: Record<string, string> = {
    name: "Nama",
    address: "Alamat",
    district: "Kecamatan",
    city: "Kota",
    renter_fullName: "Mitra",
    status: "Status",
};

export const FIELD_COLUMN_LABELS: Record<string, string> = {
    name: "Nama Lapangan",
    venue_name: "Tempat Olahraga",
    sportType_name: "Cabang Olahraga",
    sportTypeName: "Cabang Olahraga",
    pricePerHour: "Harga / Jam",
    isClosed: "Ketersediaan",
    status: "Status",
};

export const USER_COLUMN_LABELS: Record<string, string> = {
    fullName: "Nama Lengkap",
    email: "Email",
    role: "Peran",
    isVerified: "Verifikasi",
    createdAt: "Bergabung",
};

export const REPORT_COLUMN_LABELS: Record<string, string> = {
    subject: "Subjek",
    category: "Kategori",
    user: "Pengguna",
    status: "Status",
    createdAt: "Tanggal",
};

export const REVENUE_TRANSACTION_COLUMN_LABELS: Record<string, string> = {
    id: "Referensi",
    bookingDate: "Jadwal Main",
    user: "Pelanggan",
    field_name: "Lapangan & Venue",
    status: "Status Pesanan",
    paymentStatus: "Pembayaran",
    checkedInAt: "Kehadiran",
    totalPrice: "Nominal",
};
