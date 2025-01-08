"use cleint";

import { toast } from "sonner";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploaderProps {
  endpoint: keyof typeof ourFileRouter;
  onChange: (fileUrl?: string) => void;
}

export function FileUploader({ endpoint, onChange }: FileUploaderProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast.error(`ERROR! ${error?.message}`);
      }}
    />
  );
}
