"use client";

import { deleteChapter } from "@/actions/chapters";
import { ConfirmModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import { Chapter } from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  courseId: string;
  chapterId: string;
  isPublished: boolean;
  disabled: boolean;
}

export const ChapterActions = ({
  chapterId,
  courseId,
  disabled,
  isPublished,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const chapter = await deleteChapter({
        courseId,
        chapterId,
      });

      if ((chapter as { error?: string })?.error) {
        toast.error((chapter as { error: string })?.error!);
      }

      if ((chapter as Chapter)?.id) {
        toast.success("Chapter deleted successfully.");
        router.push(`/teacher/courses/${courseId}`);
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => {}}
        disabled={disabled || isLoading}
        size={"sm"}
        variant={"outline"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size={"sm"} disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
