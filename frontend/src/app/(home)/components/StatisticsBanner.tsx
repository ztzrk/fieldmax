interface StatisticsBannerProps {
    venueCount?: number;
    fieldCount?: number;
    playerCount?: number;
}

/**
 * StatisticsBanner Component
 *
 * Displays platform statistics in a highlighted banner.
 */
export function StatisticsBanner({
    venueCount,
    fieldCount,
    playerCount,
}: StatisticsBannerProps) {
    return (
        <section className="w-full py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-4xl md:text-5xl font-extrabold mb-2">
                            {venueCount}+
                        </div>
                        <div className="text-primary-foreground/80 font-medium">
                            Verified Venues
                        </div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-extrabold mb-2">
                            {fieldCount}+
                        </div>
                        <div className="text-primary-foreground/80 font-medium">
                            Premium Fields
                        </div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-extrabold mb-2">
                            {playerCount}+
                        </div>
                        <div className="text-primary-foreground/80 font-medium">
                            Happy Players
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
