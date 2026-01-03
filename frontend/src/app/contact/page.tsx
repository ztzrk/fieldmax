"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea component exists or use default
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
                                Get in touch
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Have a question about a booking, a venue, or
                                just want to say hello? We'd love to hear from
                                you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-6 bg-card border rounded-2xl">
                                <Mail className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">
                                        Email
                                    </h3>
                                    <p className="text-muted-foreground">
                                        support@fieldmax.com
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        We typically reply within 2 hours.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-card border rounded-2xl">
                                <Phone className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">
                                        Phone
                                    </h3>
                                    <p className="text-muted-foreground">
                                        +62 812 3456 7890
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Mon-Fri from 8am to 5pm.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-card border rounded-2xl">
                                <MapPin className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">
                                        Office
                                    </h3>
                                    <p className="text-muted-foreground">
                                        FieldMax HQ
                                        <br />
                                        123 Sports Avenue
                                        <br />
                                        Jakarta, Indonesia
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card border rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">
                            Send us a message
                        </h2>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="first-name"
                                        className="text-sm font-medium"
                                    >
                                        First name
                                    </label>
                                    <Input
                                        id="first-name"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="last-name"
                                        className="text-sm font-medium"
                                    >
                                        Last name
                                    </label>
                                    <Input
                                        id="last-name"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="text-sm font-medium"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 text-base"
                            >
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
