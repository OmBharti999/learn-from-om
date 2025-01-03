"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarItem = ({ href, icon: Icon, label }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        `flex items-center px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground`,
        {
          isActive:
            "text-sky-700 bg-sky-200/20 hover:bg-sky-200/30 hover:text-sky-700",
        }
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("h-5 w-5 text-slate-500", {
            isActive: "text-sky-700",
          })}
        />
        <span>{label}</span>
      </div>
      <div className={cn(`ml-auto opacity-0 border-2 border-sky-700 h-full transition-all`,{
        isActive: "opacity-100"
      })}></div>
    </button>
  );
};
