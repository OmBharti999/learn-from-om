"use client";

import { useEffect, useState } from "react";
import type { Chapter } from "@prisma/client";

interface Props {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}
export const ChaptersList = ({ items, onEdit, onReorder }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  
  return <div>chapters-list</div>;
};
