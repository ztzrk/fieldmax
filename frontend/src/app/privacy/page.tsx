export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Last updated: January 1, 2026
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            1. Information We Collect
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We collect information you provide directly to us,
                            such as when you create an account, make a booking,
                            or contact support. This may include your name,
                            email address, phone number, and payment
                            information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use your information to:
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>
                                    Facilitate bookings and process payments.
                                </li>
                                <li>
                                    Send you booking confirmations and updates.
                                </li>
                                <li>Improve and optimize our Platform.</li>
                                <li>
                                    Communicate with you about services and
                                    promotions.
                                </li>
                            </ul>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            3. Information Sharing
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We share your information with Venue Owners when you
                            make a booking to facilitate the service. We do not
                            sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            4. Data Security
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We implement appropriate technical and
                            organizational measures to protect your personal
                            information against unauthorized access, alteration,
                            disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            5. Your Rights
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You have the right to access, correct, or delete
                            your personal information. You can manage your
                            account settings directly through the Platform or
                            contact us for assistance.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
