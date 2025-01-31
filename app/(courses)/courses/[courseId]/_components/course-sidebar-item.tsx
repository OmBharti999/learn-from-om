"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  id: string;
  label: string;
  courseId: string;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export const CourseSidebarItem = ({
  courseId,
  id,
  label,
  isCompleted = false,
  isLocked = true,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const IsCompletedIcon = isCompleted ? CheckCircle : PlayCircle;
  const Icon = isLocked ? Lock : IsCompletedIcon;

  const isActive = pathname.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2  text-slate-500 text-sm font-medium pl-6 transition-all hover:bg-slate-300/20 hover:text-slate-600 ",
        {
          "bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700":
            isActive,
          "text-emerald-700 hover:text-emerald-700": isCompleted,
          "bg-emerald-200/20": isActive && isCompleted,
        }
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", {
            "text-slate-700": isActive,
            "text-emerald-700": isCompleted,
          })}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          {
            "opacity-100": isActive,
            "border-e-lime-700": isCompleted,
          }
        )}
        aria-hidden="true"
      ></div>
    </button>
  );
};
