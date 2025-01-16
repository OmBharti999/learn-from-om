"use client";

import { z } from "zod";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import MuxPlayer from "@mux/mux-player-react/lazy";
import type { Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/shared/file-uploader";

import { cn } from "@/lib/utils";
import { updateChapter } from "@/actions/chapters";

interface Props {
  initialData: Chapter & {
    muxData?: MuxData | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const VideoForm = ({ courseId, initialData, chapterId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const course = await updateChapter({
        courseId,
        values,
        chapterId: initialData.id,
      });
      if ((course as { error: string })?.error)
        toast.error((course as { error: string }).error);
      else {
        toast.success("Chapter updated");
        toggleEditing();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button variant={`ghost`} onClick={toggleEditing}>
          {isEditing && <>Cancel</>}
          {!isEditing &&
            (initialData.videoUrl ? (
              <>
                <Pencil className="h-4 w-4" />
                Edit video
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Add a video
              </>
            ))}
        </Button>
      </div>
      {!isEditing &&
        (initialData.videoUrl ? (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              loading="viewport"
              playbackId={initialData?.muxData?.playbackId || ""}
              className="h-full w-full"
            />
          </div>
        ) : (
          <div
            className={cn(
              `flex items-center justify-center h-60 bg-slate-200 rounded-md`
            )}
          >
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ))}

      {isEditing && (
        <div className="">
          <FileUploader
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) onSubmit({ videoUrl: url });
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            Upload this chapter&apos;s video.
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="mt-2 text-muted-foreground text-sm">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear
        </div>
      )}
    </div>
  );
};
