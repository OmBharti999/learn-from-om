"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { createSwapy, utils, Swapy } from "swapy";
import { Grip, Pencil } from "lucide-react";
import type { Chapter } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const ChaptersList = ({
  items,
  onEdit,
  onReorder,
}: ChaptersListProps) => {
  const swapyRef = useRef<Swapy>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [slotItemMap, setSlotItemMap] = useState(
    utils.initSlotItemMap(items, "id")
  );

  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, "id", slotItemMap),
    [items, slotItemMap]
  );

  const debouncedReorder = useDebouncedCallback((updatedOrderedChapters) => {
    onReorder(updatedOrderedChapters);
  }, 1000);

  useEffect(() => {
    const oldOrderedChapters = items.map(({ id }, index) => {
      return {
        id,
        position: index + 1,
      };
    });
    const updatedOrderedChapters = slottedItems.map(({ item }, index) => {
      return {
        id: item?.id,
        position: index + 1,
      };
    });

    // Saving initial API CALLS
    if (
      JSON.stringify(oldOrderedChapters) ===
      JSON.stringify(updatedOrderedChapters)
    ) {
      return;
    }

    // Trigger the debounced API call
    debouncedReorder(updatedOrderedChapters);
  }, [slottedItems, items, debouncedReorder]);

  // On mounted
  useEffect(() => {
    if (!containerRef.current) return;
    swapyRef.current = createSwapy(containerRef.current, {
      manualSwap: true,
    });

    swapyRef.current.onSwap((event) => {
      setSlotItemMap(event.newSlotItemMap.asArray);
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapyRef.current,
        items,
        "id",
        slotItemMap,
        setSlotItemMap
      ),
    [items]
  );

  const handleEdit = (chapterId: string) => {
    if (!chapterId) {
      console.warn("No chapter ID provided for edit action");
      return;
    }
    onEdit(chapterId);
  };

  return (
    <div ref={containerRef}>
      <div className="chapters">
        {slottedItems.map(({ item: chapter, itemId, slotId }) => (
          <div className="slot" key={slotId} data-swapy-slot={slotId}>
            <div className="chapter" key={itemId} data-swapy-item={itemId}>
              <div
                className={cn(
                  `flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm`,
                  {
                    "bg-sky-100 border-sky-200 text-sky-700":
                      chapter?.isPublished,
                  }
                )}
              >
                <div
                  className={cn(
                    `px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition`,
                    {
                      "border-r-sky-200 hover:bg-sky-100": chapter?.isPublished,
                    }
                  )}
                >
                  <Grip className="w-5 h-5" />
                </div>
                {chapter?.title}
                <div className="ml-auto pr-2 flex items-center gap-x-2">
                  {chapter?.isFree && <Badge>Free</Badge>}
                  <Badge
                    className={cn(`bg-slate-500`, {
                      "bg-sky-700": chapter?.isPublished,
                    })}
                  >
                    {chapter?.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <button
                    onClick={() => chapter?.id && handleEdit(chapter.id)}
                    className="p-1 hover:bg-slate-300 rounded transition"
                    aria-label={`Edit ${chapter?.title}`}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
