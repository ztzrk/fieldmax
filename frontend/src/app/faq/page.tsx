"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="w-full py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Have questions? We're here to help. Search for answers
                        or browse our categories below.
                    </p>

                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for answers..."
                            className="pl-10 h-12 bg-background shadow-sm"
                        />
                    </div>
                </div>
            </section>

            {/* Questions Section */}
            <section className="w-full py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-12">
                    {/* Booking Category */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">
                            Booking & Reservations
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    How do I book a field?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Booking is simple! Just browse for a venue,
                                    select your desired date and time, and click
                                    "Book Now". You'll receive an instant
                                    confirmation once your reservation is
                                    complete.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>
                                    Can I cancel or reschedule my booking?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Yes, you can cancel or reschedule up to 24
                                    hours before your reservation time through
                                    your "My Bookings" dashboard. Cancellations
                                    within 24 hours are subject to the venue's
                                    specific policy.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>
                                    Do I need to pay in advance?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Most venues require online payment to secure
                                    your slot. However, some venues offer a "Pay
                                    at Venue" option, which will be clearly
                                    indicated during the booking process.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Account Category */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">
                            Account & Profile
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-4">
                                <AccordionTrigger>
                                    How do I create an account?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Click the "Sign Up" button in the top right
                                    corner. You can register using your email or
                                    connect via Google/Facebook for quick
                                    access.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger>
                                    I forgot my password. What should I do?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Go to the Login page and click "Forgot
                                    Password". We'll send you a link to reset
                                    your password securely.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Venue Owners Category */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">
                            For Venue Owners
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-6">
                                <AccordionTrigger>
                                    How can I list my venue on FieldMax?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Becoming a partner is easy! Click "Own a
                                    Sports Venue?" on our homepage or footer to
                                    register as a Renter. Once approved, you can
                                    start listing your fields and managing
                                    bookings immediately.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-7">
                                <AccordionTrigger>
                                    What are the fees for listing?
                                </AccordionTrigger>
                                <AccordionContent>
                                    Listing your venue is free. We charge a
                                    small commission only on successful bookings
                                    made through our platform. Contact our sales
                                    team for detailed pricing structures.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Still Stuck Section */}
                    <div className="bg-muted/50 rounded-2xl p-8 text-center space-y-4 mt-12">
                        <h3 className="text-xl font-semibold">
                            Still have questions?
                        </h3>
                        <p className="text-muted-foreground">
                            Can't find the answer you're looking for? Our
                            friendly support team is here to chat.
                        </p>
                        <Link href="/contact">
                            <Button>Contact Support</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
