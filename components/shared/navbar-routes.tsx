"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Button onClick={() => router.back()} size="sm" variant="ghost">
          <LogOut className="w-4 h-4 mr-2" /> Exit
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
