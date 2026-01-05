import { Zap, Shield, Users } from "lucide-react";

/**
 * ValueProposition Component
 *
 * Displays the "Why Book with FieldMax" section with feature highlights.
 */
export function ValueProposition() {
    return (
        <section className="w-full py-24 bg-background relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-50 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Why Book with FieldMax
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We make sports booking seamless, secure, and simple so
                        you can focus on the game.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        {
                            icon: Zap,
                            title: "Instant Booking",
                            desc: "Real-time availability and immediate confirmation. No more phone calls or waiting.",
                            color: "text-amber-500",
                            bg: "bg-amber-500/10",
                            border: "hover:border-amber-500/50",
                        },
                        {
                            icon: Shield,
                            title: "Secure Payments",
                            desc: "Your transactions are protected with top-tier security standards and encryption.",
                            color: "text-violet-500",
                            bg: "bg-violet-500/10",
                            border: "hover:border-violet-500/50",
                        },
                        {
                            icon: Users,
                            title: "Trusted Community",
                            desc: "Join thousands of active players and verified venue owners across the country.",
                            color: "text-pink-500",
                            bg: "bg-pink-500/10",
                            border: "hover:border-pink-500/50",
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className={`group flex flex-col items-center text-center p-8 bg-card hover:bg-card/50 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${feature.border}`}
                        >
                            <div
                                className={`h-16 w-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                            >
                                <feature.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
