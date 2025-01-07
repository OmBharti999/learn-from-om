"use cleint";

import { toast } from "sonner";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploaderProps {
  endpoint: keyof typeof ourFileRouter;
  // onClientUploadComplete: (fileUrl: string) => void;
  onChange: (fileUrl?: string) => void;
}

export function FileUploader({ endpoint, onChange }: FileUploaderProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error) => {
        if (typeof error === "string") toast.error(error);
        else toast.error(`${error?.message}`);
      }}
    />
  );
}
