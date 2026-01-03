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
        <section className="w-full py-20 bg-primary relative overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center divide-y sm:divide-y-0 sm:divide-x divide-primary-foreground/20">
                    <div className="p-4">
                        <div className="text-5xl md:text-6xl font-black mb-2 text-white tracking-tight">
                            {venueCount}+
                        </div>
                        <div className="text-primary-foreground/90 font-medium text-lg uppercase tracking-wider">
                            Verified Venues
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-5xl md:text-6xl font-black mb-2 text-white tracking-tight">
                            {fieldCount}+
                        </div>
                        <div className="text-primary-foreground/90 font-medium text-lg uppercase tracking-wider">
                            Premium Fields
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-5xl md:text-6xl font-black mb-2 text-white tracking-tight">
                            {playerCount}+
                        </div>
                        <div className="text-primary-foreground/90 font-medium text-lg uppercase tracking-wider">
                            Happy Players
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
