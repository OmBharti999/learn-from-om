"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { updateProgress } from "@/actions/progress/update-progress";
import { useConfettiStore } from "@/hooks/use-confetti";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}

export const CourseProgressButton: React.FC<CourseProgressButtonProps> = ({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { onOpen } = useConfettiStore();
  const Icon = isCompleted ? XCircle : CheckCircle;
  const handleClick = async () => {
    try {
      setIsLoading(true);
      const response = await updateProgress({
        chapterId,
        courseId,
        isCompleted: !isCompleted,
      });

      if ((response as { error: string })?.error) {
        toast.error((response as { error: string }).error);
        // return;
      }

      if (!isCompleted && !nextChapterId) {
        onOpen();
      }
      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
      toast.success("Progress updated");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
      disabled={isLoading}
    >
      {isCompleted ? "Not completed" : "Mark as complete"}
      <Icon className="w-4 h-4 ml-2" />
    </Button>
  );
};
