import { Zap, Shield, Users } from "lucide-react";

/**
 * ValueProposition Component
 *
 * Displays the "Why Book with FieldMax" section with feature highlights.
 */
export function ValueProposition() {
    return (
        <section className="w-full py-16 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Why Book with FieldMax
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We make sports booking seamless, secure, and simple.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Instant Booking
                        </h3>
                        <p className="text-muted-foreground">
                            Real-time availability and immediate confirmation.
                            No more phone calls.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Secure Payments
                        </h3>
                        <p className="text-muted-foreground">
                            Your transactions are protected with top-tier
                            security standards.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Trusted Community
                        </h3>
                        <p className="text-muted-foreground">
                            Join thousands of players and trusted venue owners.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
