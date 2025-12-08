import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateSportType } from "@/hooks/useSportTypes";
import React from "react";
import { toast } from "sonner";
import { SportTypeForm } from "./SportTypeForm";
import { SportTypeFormValues } from "@/lib/schema/sport-types.schema";

function CreateSportTypeButton() {
    const [isOpen, setIsOpen] = React.useState(false);

    const { mutate: createSportType, isPending } = useCreateSportType();

    const handleSubmit = async (data: SportTypeFormValues) => {
        createSportType(data, {
            onSuccess: () => {
                toast.success(`${data.name} created successfully`);
                setIsOpen(false);
            },
            onError: (error) => {
                toast.error(
                    `Failed to create ${data.name} error: ${error.message}`
                );
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Create Sport Type</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Sport Type</DialogTitle>
                </DialogHeader>
                <SportTypeForm onSubmit={handleSubmit} isPending={isPending} />
            </DialogContent>
        </Dialog>
    );
}

export default CreateSportTypeButton;
