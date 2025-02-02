"use client";

import { Button } from "@/components/ui/button";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapter?: string;
  isCompleted?: boolean;
}

export const CourseProgressButton: React.FC<CourseProgressButtonProps> = ({
  chapterId,
  courseId,
  nextChapter,
  isCompleted,
}) => {
  const handleClick = () => {
    if (isCompleted) {
      console.log('Chapter already completed');
    } else {
      console.log('Completing chapter...');
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`p-2 rounded ${
        isCompleted ? 'bg-green-500' : 'bg-gray-500'
      } text-white`}
    >
      {isCompleted ? 'Chapter Completed' : 'Complete Chapter'}
    </Button>
  );
};
