"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
    onUpload: (files: File[]) => Promise<void>;
    isUploading: boolean;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function ImageUploader({ onUpload, isUploading }: ImageUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles?.length) {
                const newFiles = [...files, ...acceptedFiles];
                setFiles(newFiles);

                const newUrls = acceptedFiles.map((file) =>
                    URL.createObjectURL(file)
                );
                setPreviewUrls((prevUrls) => [...prevUrls, ...newUrls]);
            }
        },
        [files]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/webp": [".webp"],
        },
    });

    const removeFile = (indexToRemove: number) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
        setPreviewUrls(
            previewUrls.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleUploadClick = async () => {
        if (files.length > 0) {
            try {
                await onUpload(files);
            } catch (error) {
                toast.error(`Upload failed ${error}`, {
                    description: "Please try again later.",
                });
            } finally {
                setFiles([]);
                setPreviewUrls([]);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer
        ${isDragActive ? "border-primary bg-primary/10" : "border-border"}`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="text-center text-muted-foreground">
                    {isDragActive
                        ? "Drop the files here ..."
                        : "Drag & drop some files here, or click to select files"}
                </p>
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium">Selected Files:</h4>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between p-2 border rounded-md"
                            >
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={previewUrls[index]}
                                        alt={file.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 object-cover rounded-md"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Button
                type="button"
                onClick={handleUploadClick}
                disabled={files.length === 0 || isUploading}
                className="w-full"
            >
                {isUploading
                    ? `Uploading ${files.length} files...`
                    : `Upload ${files.length} Image(s)`}
            </Button>
        </div>
    );
}
