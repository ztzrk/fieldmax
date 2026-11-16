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
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Send } from "lucide-react";

const createReportSchema = z.object({
    subject: z.string().min(1, "Judul laporan harus diisi").max(100),
    description: z.string().min(1, "Deskripsi harus diisi"),
    category: z.enum(["SCAM", "TECHNICAL", "PAYMENT", "OTHER"], {
        required_error: "Kategori harus dipilih",
    }),
});

interface CreateReportFormProps {
    onSuccess: () => void;
}

export function CreateReportForm({ onSuccess }: CreateReportFormProps) {
    const { mutateAsync: createReport, isPending: isLoading } = useCreateReport();

    const form = useForm<z.infer<typeof createReportSchema>>({
        resolver: zodResolver(createReportSchema),
        defaultValues: {
            subject: "",
            description: "",
            category: undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof createReportSchema>) {
        try {
            await createReport(values);
            toast.success("Laporan berhasil dibuat");
            form.reset();
            onSuccess();
        } catch (error) {
            toast.error("Gagal membuat laporan");
            console.error(error);
        }
    }

    return (
        <Card className="h-fit sticky top-24">
            <CardHeader>
                <CardTitle>Buat Laporan Baru</CardTitle>
                <CardDescription>
                    Kirimkan kendala atau keluhan baru dan tim kami akan segera menindaklanjutinya.
                </CardDescription>
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
                                    <FormLabel>Kategori</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="SCAM">
                                                Penipuan / Kecurangan
                                            </SelectItem>
                                            <SelectItem value="TECHNICAL">
                                                Masalah Teknis
                                            </SelectItem>
                                            <SelectItem value="PAYMENT">
                                                Masalah Pembayaran
                                            </SelectItem>
                                            <SelectItem value="OTHER">
                                                Lainnya
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subjek</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ringkasan singkat masalah"
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
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Berikan informasi lengkap mengenai kendala Anda..."
                                            className="min-h-[120px]"
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
                                <FullScreenLoader />
                            ) : (
                                <Send className="mr-2 h-4 w-4" />
                            )}
                            Kirim Laporan
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
