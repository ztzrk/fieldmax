"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateReport } from "@/hooks/useReports";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, LifeBuoy, Send } from "lucide-react";
import {
    REPORT_CATEGORY_DESCRIPTIONS,
    REPORT_CATEGORY_LABELS,
} from "../constants";

const createReportSchema = z.object({
    subject: z
        .string()
        .min(1, "Judul laporan harus diisi")
        .max(100, "Maksimal 100 karakter"),
    description: z.string().min(1, "Deskripsi harus diisi"),
    category: z.enum(["SCAM", "TECHNICAL", "PAYMENT", "OTHER"], {
        required_error: "Kategori harus dipilih",
    }),
});

interface CreateReportFormProps {
    onSuccess: () => void;
}

export function CreateReportForm({ onSuccess }: CreateReportFormProps) {
    const { mutateAsync: createReport, isPending: isLoading } =
        useCreateReport();

    const form = useForm<z.infer<typeof createReportSchema>>({
        resolver: zodResolver(createReportSchema),
        defaultValues: {
            subject: "",
            description: "",
            category: undefined,
        },
    });

    const subjectValue = form.watch("subject") ?? "";
    const selectedCategory = form.watch("category");

    async function onSubmit(values: z.infer<typeof createReportSchema>) {
        try {
            await createReport(values);
            toast.success("Laporan berhasil dikirim");
            form.reset({
                subject: "",
                description: "",
                category: undefined,
            });
            onSuccess();
        } catch (error) {
            toast.error("Gagal membuat laporan");
            console.error(error);
        }
    }

    return (
        <Card className="h-fit sticky top-24 border-border/70 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <LifeBuoy className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">
                            Buat Laporan Baru
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                            Tim kami akan menindaklanjuti secepatnya.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Kategori{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-card">
                                                <SelectValue placeholder="Pilih kategori kendala" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(
                                                Object.keys(
                                                    REPORT_CATEGORY_LABELS
                                                ) as Array<
                                                    keyof typeof REPORT_CATEGORY_LABELS
                                                >
                                            ).map((key) => (
                                                <SelectItem
                                                    key={key}
                                                    value={key}
                                                >
                                                    {
                                                        REPORT_CATEGORY_LABELS[
                                                            key
                                                        ]
                                                    }
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedCategory && (
                                        <p className="text-xs text-muted-foreground">
                                            {
                                                REPORT_CATEGORY_DESCRIPTIONS[
                                                    selectedCategory
                                                ]
                                            }
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>
                                            Subjek{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <span className="text-xs text-muted-foreground">
                                            {subjectValue.length}/100
                                        </span>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="Ringkasan singkat masalah"
                                            maxLength={100}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Deskripsi{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Jelaskan kronologi atau detail kendala Anda..."
                                            className="min-h-[120px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="mr-2 h-4 w-4" />
                            )}
                            {isLoading ? "Mengirim..." : "Kirim Laporan"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
