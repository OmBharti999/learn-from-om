"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

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
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => {}}
        disabled={disabled}
        size={"sm"}
        variant={"outline"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button onClick={() => {}} size={"sm"}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
