"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Heart, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden bg-gradient-to-br from-orange-700 via-orange-600 to-amber-700 text-white">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
                    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-block px-3 py-1 mb-2 text-sm font-medium bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                            Tentang Kami
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Maksimalkan{" "}
                            <br className="hidden sm:inline" />
                            <span className="text-amber-200">
                                Permainan Anda
                            </span>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-white/90 md:text-xl lg:text-2xl leading-relaxed">
                            Kami memiliki misi untuk mempermudah akses olahraga
                            dan membangun komunitas pemain serta pemilik tempat
                            olahraga yang solid.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="w-full py-20 md:py-32 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                            {/* Placeholder for an actual team or generic sports image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                <Trophy className="h-24 w-24 text-primary/50" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Menjembatani Pemain dengan Lapangan Terbaik
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                FieldMax lahir dari keresahan sederhana: mencari
                                tempat bermain yang berkualitas seharusnya tidak
                                sulit. Baik Anda pemain santai di akhir pekan
                                maupun pemain liga kompetitif, keseruan bermain
                                berawal dari lapangan yang tepat.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Kami membangun platform yang menghubungkan
                                pemain dengan tempat olahraga terverifikasi,
                                menyederhanakan proses pemesanan agar Anda lebih
                                fokus bermain daripada mengurus jadwal.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-primary">
                                        10k+
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Pemesanan
                                    </span>
                                </div>
                                <div className="w-px h-12 bg-border" />
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-primary">
                                        500+
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Tempat Olahraga
                                    </span>
                                </div>
                                <div className="w-px h-12 bg-border" />
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-primary">
                                        100%
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Dedikasi
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="w-full py-20 bg-muted/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Nilai Utama Kami
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Prinsip yang menuntun setiap fitur yang kami bangun
                            dan setiap interaksi yang kami jalin.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Users,
                                title: "Utamakan Komunitas",
                                desc: "Kami percaya olahraga menyatukan banyak orang. Platform kami dirancang untuk mempererat kebersamaan dan sportivitas.",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10",
                            },
                            {
                                icon: Target,
                                title: "Keunggulan",
                                desc: "Kami menjaga standar kualitas tinggi pada setiap aspek, mulai dari verifikasi tempat olahraga hingga keandalan sistem.",
                                color: "text-rose-500",
                                bg: "bg-rose-500/10",
                            },
                            {
                                icon: Heart,
                                title: "Semangat Olahraga",
                                desc: "Kami juga pemain. Kami membangun layanan yang benar-benar dibutuhkan dengan kecintaan tulus terhadap olahraga.",
                                color: "text-amber-500",
                                bg: "bg-amber-500/10",
                            },
                        ].map((value, i) => (
                            <Card
                                key={i}
                                className="border-none shadow-none bg-transparent"
                            >
                                <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                                    <div
                                        className={`h-16 w-16 ${value.bg} rounded-2xl flex items-center justify-center ${value.color} mb-2`}
                                    >
                                        <value.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold">
                                        {value.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {value.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-24 bg-background">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Siap memulai permainan?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Baik Anda ingin menyewa lapangan maupun mengelola
                            tempat olahraga, FieldMax siap membantu Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                asChild
                                className="gap-2 h-12 px-8"
                            >
                                <Link href="/search">
                                    Cari Lapangan{" "}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="h-12 px-8"
                            >
                                <Link href="/reports">Hubungi Kami</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
