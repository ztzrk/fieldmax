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
            <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden bg-primary text-primary-foreground">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
                    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-block px-3 py-1 mb-2 text-sm font-medium bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                            Our Story
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Empowering Your <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                                Game
                            </span>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl lg:text-2xl leading-relaxed">
                            We're on a mission to simplify sports access and
                            build a thriving community of players and venue
                            owners.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="w-full py-20 md:py-32 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-500">
                            {/* Placeholder for an actual team or generic sports image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                <Trophy className="h-24 w-24 text-primary/50" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Bridging the Gap Between Players and Pitches
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                FieldMax was born from a simple frustration:
                                finding a quality place to play shouldn't be
                                hard. Whether you're a casual weekend warrior or
                                a competitive league player, the joy of the game
                                starts with the perfect field.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We've built a platform that connects players
                                with top-tier verified venues, streamlining the
                                booking process so you can spend less time
                                organizing and more time playing.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-primary">
                                        10k+
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Bookings
                                    </span>
                                </div>
                                <div className="w-px h-12 bg-border" />
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-primary">
                                        500+
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Venues
                                    </span>
                                </div>
                                <div className="w-px h-12 bg-border" />
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-primary">
                                        100%
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Passion
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
                            Our Core Values
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            The principles that guide every feature we build and
                            every interaction we have.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Users,
                                title: "Community First",
                                desc: "We believe sport brings people together. Our platform is designed to foster connection and fair play.",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10",
                            },
                            {
                                icon: Target,
                                title: "Excellence",
                                desc: "We strive for high quality in everything, from the venues we verify to the code we write.",
                                color: "text-rose-500",
                                bg: "bg-rose-500/10",
                            },
                            {
                                icon: Heart,
                                title: "Passion",
                                desc: "We are players too. We build the tools we want to use, with genuine love for the game.",
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
                            Ready to join the game?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Whether you're looking to book a court or manage
                            one, FieldMax is here to help you succeed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/search">
                                <Button size="lg" className="gap-2 h-12 px-8">
                                    Find a Field{" "}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 px-8"
                                >
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
