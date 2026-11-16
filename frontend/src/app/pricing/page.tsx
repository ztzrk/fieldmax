"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <section className="w-full py-20 md:py-32 bg-background">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <div className="max-w-3xl mx-auto space-y-4 mb-16">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            Harga Sederhana &amp; Transparan
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Tanpa biaya tersembunyi, tanpa biaya berlangganan
                            untuk pemain.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Player Plan */}
                        <div className="flex flex-col p-8 bg-card border rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-2xl font-bold">Untuk Pemain</h3>
                            <div className="mt-4 mb-8">
                                <span className="text-5xl font-extrabold">
                                    Gratis
                                </span>
                                <span className="text-muted-foreground ml-2">
                                    / selamanya
                                </span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1 text-left">
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Cari tempat olahraga tanpa batas</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Cek ketersediaan jadwal real-time</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Konfirmasi pemesanan instan</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Pembayaran digital aman</span>
                                </li>
                            </ul>
                            <Link href="/search">
                                <Button
                                    className="w-full h-12 text-lg"
                                    size="lg"
                                >
                                    Mulai Memesan
                                </Button>
                            </Link>
                        </div>

                        {/* Venue Owner Plan */}
                        <div className="flex flex-col p-8 bg-slate-950 text-slate-50 border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-bl-xl">
                                POPULER
                            </div>
                            <h3 className="text-2xl font-bold">
                                Untuk Pemilik Tempat Olahraga
                            </h3>
                            <div className="mt-4 mb-8">
                                <span className="text-5xl font-extrabold">
                                    5%
                                </span>
                                <span className="text-slate-400 ml-2">
                                    komisi
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 mb-6 text-left">
                                Kami hanya mengenakan komisi saat Anda menerima
                                pemesanan. Tanpa biaya pendaftaran atau langganan
                                bulanan.
                            </p>
                            <ul className="space-y-4 mb-8 flex-1 text-left text-slate-200">
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Daftar tempat olahraga tanpa batas</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>
                                        Dashboard manajemen pemesanan lengkap
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Penjadwalan otomatis</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Pemasaran &amp; promosi</span>
                                </li>
                            </ul>
                            <Link href="/register/renter">
                                <Button
                                    className="w-full h-12 text-lg bg-white text-slate-950 hover:bg-slate-200"
                                    size="lg"
                                >
                                    Daftarkan Tempat Olahraga
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
