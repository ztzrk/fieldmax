"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SportType {
    id: string;
    name: string;
}

interface SportTypeFilterProps {
    sportTypes: SportType[];
    selectedId?: string;
    /** If provided, uses onClick handlers. Otherwise uses Link navigation. */
    onSelect?: (id: string | undefined) => void;
    /** Base href for Link mode (e.g., "/fields") */
    baseHref?: string;
}

/**
 * SportTypeFilter Component
 *
 * Displays a horizontal list of sport type filter buttons.
 * Supports two modes:
 * - Link mode: navigates to {baseHref}?sport={id}
 * - Controlled mode: calls onSelect with the selected id
 */
export function SportTypeFilter({
    sportTypes,
    selectedId,
    onSelect,
    baseHref = "/fields",
}: SportTypeFilterProps) {
    const isControlled = typeof onSelect === "function";

    const allButtonContent = (
        <Button
            variant={selectedId === undefined ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={isControlled ? () => onSelect(undefined) : undefined}
        >
            All
        </Button>
    );

    return (
        <div className="flex flex-wrap items-center gap-2">
            {isControlled ? (
                allButtonContent
            ) : (
                <Link href={baseHref}>{allButtonContent}</Link>
            )}

            {sportTypes.map((type) => {
                const isSelected = selectedId === type.id;
                const buttonContent = (
                    <Button
                        key={type.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={
                            isControlled ? () => onSelect(type.id) : undefined
                        }
                    >
                        {type.name}
                    </Button>
                );

                return isControlled ? (
                    <span key={type.id}>{buttonContent}</span>
                ) : (
                    <Link key={type.id} href={`${baseHref}?sport=${type.id}`}>
                        {buttonContent}
                    </Link>
                );
            })}
        </div>
    );
}
