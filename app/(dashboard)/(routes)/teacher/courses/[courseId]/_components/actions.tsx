"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Course } from "@prisma/client";

import { ConfirmModal } from "@/components/modals";
import { Button } from "@/components/ui/button";

import { deleteCourse, publishCourse } from "@/actions/courses";
import { useConfettiStore } from "@/hooks/use-confetti";

interface Props {
  courseId: string;
  isPublished: boolean;
  disabled: boolean;
}

export const Actions = ({ courseId, disabled, isPublished }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { onOpen } = useConfettiStore();

  const onClick = async () => {
    try {
      setIsLoading(true);
      const course = await publishCourse({
        courseId,
        state: !isPublished,
      });
      if ((course as { error?: string })?.error) {
        toast.error((course as { error: string })?.error);
      }

      if ((course as Course)?.id) {
        toast.success(
          (course as Course).isPublished
            ? "Course published"
            : "Course unpublished"
        );

        if ((course as Course).isPublished) {
          onOpen();
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const chapter = await deleteCourse({
        courseId,
      });

      if ((chapter as { error?: string })?.error) {
        toast.error((chapter as { error: string })?.error);
      }

      if ((chapter as Course)?.id) {
        toast.success("Course deleted successfully.");
        router.push(`/teacher/courses`);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
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
