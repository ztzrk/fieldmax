"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * RenterCTA Component
 *
 * Call-to-action section for venue owners to partner with FieldMax.
 */
export function RenterCTA() {
    return (
        <section className="w-full py-24 bg-background px-4 md:px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="relative rounded-3xl overflow-hidden bg-primary shadow-xl transition-shadow duration-300 hover:shadow-2xl">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-700 to-amber-800" />
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/20 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center text-center p-10 md:p-16 space-y-8">
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                Punya Tempat Olahraga?
                            </h2>
                            <p className="text-white/90 text-lg md:text-xl leading-relaxed font-medium">
                                Bermitra dengan FieldMax untuk mengelola pemesanan
                                secara otomatis, meningkatkan keterlihatan tempat,
                                dan mengembangkan bisnis dengan alat manajemen terbaik.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link
                                href="/register/renter"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="lg"
                                    className="w-full bg-white text-slate-900 hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 font-bold h-12 px-8 text-base shadow-lg hover:-translate-y-0.5"
                                >
                                    Daftar Sebagai Pengelola
                                </Button>
                            </Link>
                            <Link href="/about" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full bg-transparent border-2 border-white/80 text-white hover:bg-white hover:text-slate-900 hover:border-white h-12 px-8 text-base transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                                >
                                    Pelajari Lebih Lanjut
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
