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
                <CardTitle>Create New Report</CardTitle>
                <CardDescription>
                    Submit a new issue and we'll get back to you.
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
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="SCAM">
                                                Scam / Fraud
                                            </SelectItem>
                                            <SelectItem value="TECHNICAL">
                                                Technical Issue
                                            </SelectItem>
                                            <SelectItem value="PAYMENT">
                                                Payment Issue
                                            </SelectItem>
                                            <SelectItem value="OTHER">
                                                Other
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
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Brief summary of the issue"
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide detailed information..."
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
                            Submit Report
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
