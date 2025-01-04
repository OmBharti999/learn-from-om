"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Button size="sm" variant="ghost" asChild>
          <Link href="/">
            <LogOut className="w-4 h-4 mr-2" /> Exit
          </Link>
        </Button>
      ) : (
        <Button size="sm" variant="ghost" asChild>
          <Link href="/teacher/courses">Teacher Mode</Link>
        </Button>
      )}
      <UserButton />
    </div>
  );
};
