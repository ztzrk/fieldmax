import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    imageSrc?: string;
    quote?: string;
    author?: string;
}

export function AuthLayout({
    children,
    title,
    description,
    imageSrc = "https://images.unsplash.com/photo-1579952363873-27f3bade8f55?q=80&w=1935&auto=format&fit=crop",
    quote = "The only way to prove that you're a good sport is to lose.",
    author = "Ernie Banks",
}: AuthLayoutProps) {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-[40%_1fr] lg:px-0">
            <Link
                href="/"
                className="absolute right-4 top-4 md:right-8 md:top-8 z-20 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
                Back to Home
            </Link>

            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden">
                <div className="absolute inset-0 bg-zinc-900" />
                <img
                    src={imageSrc}
                    alt="Sport Field"
                    className="object-cover opacity-60 w-full h-full scale-105"
                />

                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent mix-blend-overlay" />

                <div className="relative z-20 flex items-center gap-2 text-2xl font-bold tracking-tight">
                    <div className="relative h-10 w-10">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            loading="eager"
                            width={40}
                            height={40}
                            className="object-contain w-full h-full drop-shadow-md"
                        />
                    </div>
                    <span className="drop-shadow-md">FieldMax</span>
                </div>

                <div className="relative z-20 mt-auto max-w-lg">
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-medium leading-normal drop-shadow-lg italic">
                            &ldquo;{quote}&rdquo;
                        </p>
                        <footer className="text-base text-white/90 font-medium flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-primary/80 rounded-full" />
                            {author}
                        </footer>
                    </blockquote>
                </div>
            </div>

            <div className="lg:p-8 relative z-10 w-full">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
