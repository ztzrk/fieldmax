export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Last updated: January 1, 2026
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using FieldMax ("the Platform"), you
                            agree to be bound by these Terms of Service. If you
                            do not agree to these terms, please do not use our
                            services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            2. User Accounts
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To access certain features of the Platform, you may
                            be required to create an account. You are
                            responsible for maintaining the confidentiality of
                            your account credentials and for all activities that
                            occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            3. Booking and Payments
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            FieldMax facilitates bookings between players and
                            venue owners. By making a booking, you agree to the
                            specific venue's terms and conditions, including
                            their cancellation policy. All payments are
                            processed securely through our trusted payment
                            partners.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            4. Usage Guidelines
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You agree explicitly not to:
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>
                                    Use the Platform for any illegal purpose.
                                </li>
                                <li>
                                    Attempt to gain unauthorized access to any
                                    portion of the Platform.
                                </li>
                                <li>
                                    Harass or harm other users of the Platform.
                                </li>
                            </ul>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            5. Limitation of Liability
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            FieldMax is not liable for any indirect, incidental,
                            special, consequential, or punitive damages
                            resulting from your use of or inability to use the
                            Platform.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
