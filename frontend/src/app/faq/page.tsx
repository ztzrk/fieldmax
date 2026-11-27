"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="w-full py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Pertanyaan yang Sering Diajukan (FAQ)
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Punya pertanyaan? Kami siap membantu. Cari jawaban atau
                        jelajahi kategori di bawah ini.
                    </p>

                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            aria-label="Cari jawaban di FAQ"
                            placeholder="Cari jawaban..."
                            className="pl-10 h-12 bg-background shadow-sm"
                        />
                    </div>
                </div>
            </section>

            {/* Questions Section */}
            <section className="w-full py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-12">
                    {/* Booking Category */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">
                            Pemesanan &amp; Reservasi
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    Bagaimana cara memesan lapangan?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Sangat mudah! Cukup pilih tempat olahraga
                                    dan lapangan yang diinginkan, tentukan
                                    tanggal serta slot jam, lalu klik konfirmasi
                                    pemesanan. Anda akan menerima konfirmasi
                                    instan setelah pembayaran selesai.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>
                                    Apakah saya bisa membatalkan pemesanan?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Ya, Anda dapat membatalkan pemesanan yang
                                    masih berstatus menunggu pembayaran melalui
                                    halaman Riwayat Pemesanan. Untuk pemesanan
                                    yang sudah dibayar, ketentuan mengacu pada
                                    kebijakan masing-masing tempat olahraga.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>
                                    Apakah saya harus membayar di muka?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Ya, pembayaran dilakukan secara online
                                    melalui Midtrans Snap (QRIS, Virtual
                                    Account, atau e-Wallet) untuk mengunci slot
                                    jadwal agar tidak bentrok dengan pengguna
                                    lain.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Account Category */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">
                            Akun &amp; Profil
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-4">
                                <AccordionTrigger>
                                    Bagaimana cara membuat akun?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Klik tombol &quot;Daftar&quot; di pojok
                                    kanan atas, isi data diri dan email Anda,
                                    lalu masukkan kode verifikasi 6 digit yang
                                    dikirimkan ke email Anda.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger>
                                    Saya lupa kata sandi. Apa yang harus saya
                                    lakukan?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Buka halaman Masuk dan klik &quot;Lupa kata
                                    sandi?&quot;. Kami akan mengirimkan tautan ke
                                    email Anda untuk mengatur ulang kata sandi
                                    dengan aman.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Venue Owners Category */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">
                            Untuk Pemilik Tempat Olahraga
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-6">
                                <AccordionTrigger>
                                    Bagaimana cara mendaftarkan tempat olahraga
                                    di FieldMax?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Klik &quot;Daftar sebagai Mitra&quot; pada
                                    halaman pendaftaran. Setelah akun aktif,
                                    Anda dapat menambahkan data tempat olahraga,
                                    foto, jadwal operasional, serta unit
                                    lapangan untuk ditinjau oleh admin.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-7">
                                <AccordionTrigger>
                                    Apakah ada biaya pendaftaran tempat
                                    olahraga?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Pendaftaran tempat olahraga gratis. Kami
                                    hanya mengenakan komisi kecil pada setiap
                                    pemesanan yang berhasil melalui platform.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Still Stuck Section */}
                    <div className="bg-muted/50 rounded-2xl p-8 text-center space-y-4 mt-12">
                        <h3 className="text-xl font-semibold">
                            Masih punya pertanyaan?
                        </h3>
                        <p className="text-muted-foreground">
                            Tidak menemukan jawaban yang Anda cari? Tim bantuan
                            kami siap membantu Anda.
                        </p>
                        <Link href="/reports">
                            <Button>Hubungi Bantuan</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
