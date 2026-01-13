"use client";
import { useGetPublicRenter } from "@/hooks/useGetPublicRenter";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { VenueCard } from "@/components/venues/VenueCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Globe, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function RenterProfilePage() {
    const router = useRouter();
    const params = useParams();
    const renterId = params.id as string;

    const {
        data: profileData,
        isLoading,
        isError,
    } = useGetPublicRenter(renterId);

    if (isLoading) return <FullScreenLoader />;
    if (isError || !profileData)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-xl font-semibold">Renter Not Found</h2>
                <p className="text-muted-foreground">
                    The renter profile you are looking for does not exist.
                </p>
                <Link href="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
            </div>
        );

    const { renter, venues } = profileData;
    const profile = renter.profile || {};

    return (
        <div className="container max-w-[1400px] mx-auto py-8 px-4 md:px-6 min-h-screen bg-background pb-20">
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
                <Button
                    variant="link"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors pl-0"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>

            <div className="space-y-8">
                {/* Header / Profile Info */}
                <Card className="border-none shadow-sm bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
                    <CardContent className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                            <AvatarImage
                                src={
                                    profile.companyLogoUrl ||
                                    profile.profilePictureUrl ||
                                    ""
                                }
                                alt={renter.fullName}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                                {profile.companyName?.[0] || renter.fullName[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {profile.companyName || renter.fullName}
                                </h1>
                                {profile.companyName && (
                                    <p className="text-muted-foreground text-lg">
                                        {renter.fullName}
                                    </p>
                                )}
                            </div>

                            {profile.companyDescription && (
                                <p className="max-w-2xl text-muted-foreground">
                                    {profile.companyDescription}
                                </p>
                            )}

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                {profile.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{profile.address}</span>
                                    </div>
                                )}
                                {profile.companyWebsite && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        <a
                                            href={profile.companyWebsite}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            Visit Website
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    <span>{venues.length} Venues</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Venues Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Available Venues</h2>
                    </div>

                    {venues.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {venues.map((venue: any) => (
                                <VenueCard key={venue.id} venue={venue} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed text-muted-foreground">
                            <p>No venues available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
