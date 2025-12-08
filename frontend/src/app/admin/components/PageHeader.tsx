import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    backHref: string;
    children?: ReactNode;
}

export function PageHeader({
    title,
    description,
    backHref,
    children,
}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={backHref}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
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
