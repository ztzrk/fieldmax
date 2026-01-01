import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * RenterCTA Component
 *
 * Call-to-action section for venue owners to partner with FieldMax.
 */
export function RenterCTA() {
    return (
        <section className="w-full py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

                    <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
                        Own a Sports Venue?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                        Partner with FieldMax to streamline your bookings,
                        increase visibility, and grow your business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Link href="/register/renter">
                            <Button
                                size="lg"
                                className="bg-white text-slate-900 hover:bg-slate-100"
                            >
                                Register as Renter
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/30 text-white hover:bg-white/10"
                            >
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
