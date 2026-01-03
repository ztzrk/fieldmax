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
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" />
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px]" />

                    <div className="relative z-10 flex flex-col items-center text-center p-12 md:p-16 space-y-8">
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                Own a Sports Venue?
                            </h2>
                            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
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
                                    className="w-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all duration-300 font-bold h-12 px-8"
                                >
                                    Register as Renter
                                </Button>
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/40 h-12 px-8 backdrop-blur-sm"
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
