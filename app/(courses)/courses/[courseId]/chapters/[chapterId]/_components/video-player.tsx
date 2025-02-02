"use client";

import { updateProgress } from "@/actions/progress/update-progress";
import { useConfettiStore } from "@/hooks/use-confetti";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  title: string;
  nextChapter?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

export const VideoPlayer = ({
  chapterId,
  completeOnEnd,
  courseId,
  isLocked,
  playbackId,
  title,
  nextChapter,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const { onOpen } = useConfettiStore();

  const onEnd = async () => {
    try {
      // First time auto redirect to next chapter
      if (completeOnEnd) {
        await updateProgress({ chapterId, courseId, isCompleted: true });
        if (!nextChapter) {
          onOpen();
        }
        toast.success("Progress updated");

        if (nextChapter) {
          router.push(`/courses/${courseId}/chapters/${nextChapter}`);
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="aspect-video relative">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center z-20">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center flex-col gap-y-2 text-secondary">
          <Lock className="w-8 h-8" />
          <p className="text-sm">This chapter is locked.</p>
        </div>
      )}

      {!isLocked && (
        <MuxPlayer
          title={title}
          playbackId={playbackId}
          className={cn({
            hidden: !isReady,
          })}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
        />
      )}
    </div>
  );
};
