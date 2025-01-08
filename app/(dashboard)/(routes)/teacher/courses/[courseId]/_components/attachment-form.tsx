"use client";

import { z } from "zod";
import { Delete, File, ImageIcon, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import type { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/shared/file-uploader";

import {
  addAttachment,
  deleteAttachment,
  updateCourse,
} from "@/actions/courses";
import { cn } from "@/lib/utils";

interface Props {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: "Attachment is required",
  }),
});

export const AttachmentForm = ({ courseId, initialData }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const course = await addAttachment(courseId, values.url);
      if ((course as { error: string })?.error)
        toast.error((course as { error: string }).error);
      else {
        toast.success("Course updated");
        toggleEditing();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (attachmentId: string) => {
    try {
      const course = await deleteAttachment(attachmentId);
      if ((course as { error: string })?.error)
        toast.error((course as { error: string }).error);
      else {
        toast.success("Attachment deleted");
        // toggleEditing();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachment
        <Button variant={`ghost`} onClick={toggleEditing}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length ? (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full border border-sky-200 text-sky-700 rounded-md bg-sky-100"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />

                  <p className="text-xs font-medium line-clamp-1">
                    {attachment.name}
                  </p>
                  <Button
                    variant="ghost"
                    className="ml-auto hover:opacity-75 transition"
                    size="sm"
                    onClick={() => {
                      onDelete(attachment.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachment yet
            </p>
          )}
        </>
      )}

      {isEditing && (
        <div className="">
          <FileUploader
            endpoint="courseAttachments"
            onChange={(url) => {
              if (url) onSubmit({ url });
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            Add anything that might be helpful to students
          </div>
        </div>
      )}
    </div>
  );
};
