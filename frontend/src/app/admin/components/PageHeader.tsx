import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: ReactNode;
}

/**
 * Reusable header component for admin pages.
 * Displays a title, optional description, and an optional back button.
 */
export function PageHeader({ title, description, children }: PageHeaderProps) {
    const router = useRouter();
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground">{description}</p>
                    )}
                </div>
            </div>
            {children && <div>{children}</div>}
        </div>
    );
}
