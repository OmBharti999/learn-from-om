"use client";

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
  return <div>VideoPlayer</div>;
};
