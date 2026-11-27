"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Check,
    RotateCcw,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

export interface SportTypeOption {
    id: string;
    name: string;
}

export interface PricePreset {
    id: string;
    label: string;
    minPrice?: number;
    maxPrice?: number;
}

export const FIELD_PRICE_PRESETS: PricePreset[] = [
    { id: "ALL", label: "Semua Harga" },
    { id: "UNDER_100", label: "< Rp 100 rb", maxPrice: 99999 },
    {
        id: "100_200",
        label: "Rp 100–200 rb",
        minPrice: 100000,
        maxPrice: 200000,
    },
    { id: "OVER_200", label: "> Rp 200 rb", minPrice: 200001 },
];

interface SportTypeFilterProps {
    sportTypes: SportTypeOption[];
    selectedSportType?: string;
    onSelectSportType: (sportId?: string) => void;
    title?: string;
}

export function SportTypeFilter({
    sportTypes,
    selectedSportType,
    onSelectSportType,
    title = "Cabang Olahraga",
}: SportTypeFilterProps) {
    const [sportQuery, setSportQuery] = useState("");

    const filteredSports = useMemo(() => {
        const q = sportQuery.trim().toLowerCase();
        if (!q) return sportTypes;
        return sportTypes.filter((s) => s.name.toLowerCase().includes(q));
    }, [sportTypes, sportQuery]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                    {title}
                </h3>
                {sportTypes.length > 0 && (
                    <span className="text-[11px] text-muted-foreground">
                        {sportTypes.length} pilihan
                    </span>
                )}
            </div>

            {/* Searchable input for scalability (100+ sports) */}
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                    type="search"
                    value={sportQuery}
                    onChange={(e) => setSportQuery(e.target.value)}
                    placeholder="Cari cabang olahraga..."
                    className="h-8 pl-8 text-xs"
                />
            </div>

            {/* Scrollable bounded list */}
            <div className="max-h-56 overflow-y-auto pr-1 space-y-1">
                {!sportQuery.trim() && (
                    <button
                        type="button"
                        onClick={() => onSelectSportType(undefined)}
                        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                            selectedSportType === undefined
                                ? "bg-primary/10 text-primary"
                                : "text-foreground/80 hover:bg-muted"
                        }`}
                    >
                        <span>Semua Olahraga</span>
                        {selectedSportType === undefined && (
                            <Check className="h-3.5 w-3.5 shrink-0" />
                        )}
                    </button>
                )}

                {filteredSports.length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                        Olahraga tidak ditemukan
                    </p>
                ) : (
                    filteredSports.map((sport) => {
                        const isSelected = selectedSportType === sport.id;
                        return (
                            <button
                                key={sport.id}
                                type="button"
                                onClick={() =>
                                    onSelectSportType(
                                        isSelected ? undefined : sport.id
                                    )
                                }
                                className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors text-left ${
                                    isSelected
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground/80 hover:bg-muted"
                                }`}
                            >
                                <span className="truncate">{sport.name}</span>
                                {isSelected && (
                                    <Check className="h-3.5 w-3.5 shrink-0 ml-2" />
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

interface PriceFilterProps {
    minPrice?: number;
    maxPrice?: number;
    onApplyPrice: (minPrice?: number, maxPrice?: number) => void;
}

export function PriceFilter({
    minPrice,
    maxPrice,
    onApplyPrice,
}: PriceFilterProps) {
    const [customMin, setCustomMin] = useState(
        minPrice !== undefined ? String(minPrice) : ""
    );
    const [customMax, setCustomMax] = useState(
        maxPrice !== undefined ? String(maxPrice) : ""
    );

    const activePresetId = useMemo(() => {
        const match = FIELD_PRICE_PRESETS.find(
            (p) => p.minPrice === minPrice && p.maxPrice === maxPrice
        );
        return match?.id ?? null;
    }, [minPrice, maxPrice]);

    const handlePresetClick = (preset: PricePreset) => {
        setCustomMin(
            preset.minPrice !== undefined ? String(preset.minPrice) : ""
        );
        setCustomMax(
            preset.maxPrice !== undefined ? String(preset.maxPrice) : ""
        );
        onApplyPrice(preset.minPrice, preset.maxPrice);
    };

    const handleCustomApply = () => {
        const parsedMin = customMin.trim() ? Number(customMin) : undefined;
        const parsedMax = customMax.trim() ? Number(customMax) : undefined;
        onApplyPrice(
            parsedMin !== undefined && !Number.isNaN(parsedMin)
                ? parsedMin
                : undefined,
            parsedMax !== undefined && !Number.isNaN(parsedMax)
                ? parsedMax
                : undefined
        );
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
                Harga per Jam
            </h3>

            {/* Preset Pills */}
            <div className="grid grid-cols-2 gap-1.5">
                {FIELD_PRICE_PRESETS.map((preset) => {
                    const isActive = activePresetId === preset.id;
                    return (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => handlePresetClick(preset)}
                            className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all text-center whitespace-nowrap ${
                                isActive
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border bg-background/60 text-foreground/80 hover:bg-muted"
                            }`}
                        >
                            {preset.label}
                        </button>
                    );
                })}
            </div>

            {/* Custom Min / Max */}
            <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
                            Rp
                        </span>
                        <Input
                            type="number"
                            min={0}
                            placeholder="Min"
                            value={customMin}
                            onChange={(e) => setCustomMin(e.target.value)}
                            className="h-8 pl-7 text-xs"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
                            Rp
                        </span>
                        <Input
                            type="number"
                            min={0}
                            placeholder="Maks"
                            value={customMax}
                            onChange={(e) => setCustomMax(e.target.value)}
                            className="h-8 pl-7 text-xs"
                        />
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCustomApply}
                    className="w-full h-8 text-xs"
                >
                    Terapkan Harga
                </Button>
            </div>
        </div>
    );
}

interface CatalogFilterSidebarProps {
    activeFilterCount: number;
    onReset: () => void;
    children: React.ReactNode;
}

export function CatalogFilterSidebar({
    activeFilterCount,
    onReset,
    children,
}: CatalogFilterSidebarProps) {
    return (
        <aside className="hidden lg:block w-68 shrink-0">
            <div className="sticky top-22 rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                        <h2 className="font-semibold text-sm">Filter</h2>
                        {activeFilterCount > 0 && (
                            <Badge
                                variant="secondary"
                                className="h-5 px-1.5 text-[11px] bg-primary/10 text-primary"
                            >
                                {activeFilterCount}
                            </Badge>
                        )}
                    </div>
                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Reset
                        </button>
                    )}
                </div>
                <Separator />
                {children}
            </div>
        </aside>
    );
}

interface MobileFilterDrawerProps {
    activeFilterCount: number;
    onReset: () => void;
    children: React.ReactNode;
}

export function MobileFilterDrawer({
    activeFilterCount,
    onReset,
    children,
}: MobileFilterDrawerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="lg:hidden gap-2 bg-card shrink-0"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 && (
                        <Badge className="h-5 px-1.5 text-[11px]">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[310px] sm:w-[360px] p-0 flex flex-col">
                <SheetHeader className="px-5 py-4 border-b border-border flex-row items-center justify-between space-y-0">
                    <SheetTitle className="text-base flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                        Filter
                    </SheetTitle>
                    {activeFilterCount > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="h-8 text-xs text-primary"
                        >
                            Reset
                        </Button>
                    )}
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {children}
                </div>
                <SheetFooter className="p-4 border-t border-border">
                    <Button
                        type="button"
                        className="w-full"
                        onClick={() => setOpen(false)}
                    >
                        Terapkan Filter
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export interface ActiveChip {
    key: string;
    label: string;
    onRemove: () => void;
}

export function ActiveFilterChips({
    chips,
    onResetAll,
}: {
    chips: ActiveChip[];
    onResetAll: () => void;
}) {
    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">
                Filter aktif:
            </span>
            {chips.map((chip) => (
                <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
                >
                    <span>{chip.label}</span>
                    <X className="h-3 w-3" />
                </button>
            ))}
            <button
                type="button"
                onClick={onResetAll}
                className="text-xs text-muted-foreground hover:text-foreground underline ml-1"
            >
                Hapus semua
            </button>
        </div>
    );
}
