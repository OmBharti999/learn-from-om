"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursesPage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursesPage ? (
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
    </>
  );
};
