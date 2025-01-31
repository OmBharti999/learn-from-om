"use client";

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

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
          onEnded={() => {}}
          autoPlay
        />
      )}
    </div>
  );
};
