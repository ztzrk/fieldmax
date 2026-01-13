"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * RenterCTA Component
 *
 * Call-to-action section for venue owners to partner with FieldMax.
 */
export function RenterCTA() {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const sectionRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateX = (mouseY / (rect.height / 2)) * -2; // Max 2deg rotation
        const rotateY = (mouseX / (rect.width / 2)) * 2;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <section className="w-full py-24 bg-background px-4 md:px-6 perspective-1000">
            <div
                ref={sectionRef}
                className="container mx-auto max-w-5xl transition-transform duration-200 ease-out"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                }}
            >
                <div className="relative rounded-3xl overflow-hidden bg-primary shadow-2xl group hover:shadow-primary/50 transition-shadow duration-500">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-700 to-amber-800" />

                    {/* Animated Blobs */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-[80px] animate-blob" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/20 rounded-full blur-[80px] animate-blob animation-delay-2000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse" />

                    {/* Grid Pattern Overlay */}

                    <div className="relative z-10 flex flex-col items-center text-center p-12 md:p-16 space-y-8 transform transition-transform duration-500 group-hover:scale-105">
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
                                Own a Sports Venue?
                            </h2>
                            <p className="text-slate-100 text-lg md:text-xl leading-relaxed font-medium/90 text-shadow-sm">
                                Partner with FieldMax to streamline your
                                bookings, increase visibility, and grow your
                                business with our powerful management tools.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link
                                href="/register/renter"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="lg"
                                    className="w-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all duration-300 font-bold h-14 px-8 text-lg shadow-xl hover:shadow-2xl hover:shadow-white/20"
                                >
                                    Register as Renter
                                </Button>
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full bg-transparent border-2 border-white/80 text-white hover:bg-white hover:text-black hover:border-white h-14 px-8 backdrop-blur-sm text-lg transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
