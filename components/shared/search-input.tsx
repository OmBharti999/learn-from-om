"use client";

import { Search } from "lucide-react";
import { useDebouncedCallback, useDebounce } from "use-debounce";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const debouncedValue = useDebounce(value, 650);

  const currenctCategoryId = searchParams.get("categoryId");

  useEffect(() => {}, []);
  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        className="w-full md:w-72 pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course..."
      />
    </div>
  );
};
