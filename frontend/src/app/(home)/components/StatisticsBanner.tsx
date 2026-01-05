import { useEffect, useState, useRef } from "react";

interface StatisticsBannerProps {
    venueCount?: number;
    fieldCount?: number;
    playerCount?: number;
}

function useElementOnScreen(options: IntersectionObserverInit) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (containerRef.current)
                    observer.unobserve(containerRef.current);
            }
        }, options);

        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, [options]);

    return [containerRef, isVisible] as const;
}

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const [containerRef, isVisible] = useElementOnScreen({
        threshold: 0.1,
    });

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function for smooth animation (easeOutExpo)
            const easeOut = (x: number) =>
                x === 1 ? 1 : 1 - Math.pow(2, -10 * x);

            setCount(Math.floor(easeOut(percentage) * end));

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration, isVisible]);

    return <span ref={containerRef}>{count}</span>;
}

/**
 * StatisticsBanner Component
 *
 * Displays platform statistics in a highlighted banner with animated counters.
 */
export function StatisticsBanner({
    venueCount = 0,
    fieldCount = 0,
    playerCount = 0,
}: StatisticsBannerProps) {
    return (
        <section className="w-full py-20 bg-gradient-to-r from-primary to-orange-700 relative overflow-hidden text-white shadow-2xl">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center divide-y sm:divide-y-0 sm:divide-x divide-primary-foreground/20">
                    <div className="p-4">
                        <div className="text-5xl md:text-6xl font-black mb-2 text-white tracking-tight tabular-nums">
                            <Counter end={venueCount} />+
                        </div>
                        <div className="text-primary-foreground/90 font-medium text-lg uppercase tracking-wider">
                            Verified Venues
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-5xl md:text-6xl font-black mb-2 text-white tracking-tight tabular-nums">
                            <Counter end={fieldCount} />+
                        </div>
                        <div className="text-primary-foreground/90 font-medium text-lg uppercase tracking-wider">
                            Premium Fields
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-5xl md:text-6xl font-black mb-2 text-white tracking-tight tabular-nums">
                            <Counter end={playerCount} />+
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
