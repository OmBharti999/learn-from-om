"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import queryString from "query-string";
import { useCallback } from "react";
import { IconType } from "react-icons/lib";

import { cn } from "@/lib/utils";

interface Props {
  label: string;
  icon?: IconType;
  value?: string;
}
export const CategoryItem = ({ label, icon: Icon, value }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentTitle) params.set("title", currentTitle);
    // Clearing the categoryId if same is tapped again
    if (isSelected) params.delete("categoryId");
    else params.set("categoryId", value as string);
    return params.toString();
  }, [searchParams]);

  // const onClickSimilar = () => {
  //   const url = queryString.stringifyUrl(
  //     {
  //       url: pathname,
  //       query: {
  //         title: currentTitle,
  //         categoryId: isSelected ? null : value,
  //       },
  //     },
  //     {
  //       skipNull: true,
  //       skipEmptyString: true,
  //     }
  //   );

  //   router.push(url);
  // };

  const onClick = () => {
    router.push(pathname + "?" + createQueryString());
  };
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-x-1 border border-slate-200 text-sm py-2 px-3 rounded-full hover:border-sky-700 transition",
        {
          "border-sky-700 bg-sky-200/20 text-sky-800": isSelected,
        }
      )}
      onClick={onClick}
    >
      {Icon && <Icon size={20} />}

      <div className="truncate">{label}</div>
    </button>
  );
};
