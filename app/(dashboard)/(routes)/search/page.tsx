import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Categories } from "./_components";
import { SearchInput } from "@/components/shared/search-input";

import { db } from "@/lib/db";
import { getCourses } from "@/actions/courses/get-course";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{
  // [key: string]: string | string[] | undefined
  title: string;
  categoryId: string;
}>;

interface SearchPageProps {
  params: Params;
  searchParams: SearchParams;
}

const SearchPage = async (props: SearchPageProps) => {
  const searchParams = await props.searchParams;
  // const { title, categoryId } = searchParams;

  const { userId } = await auth();
  if (!userId) return redirect("/");
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const courses = await getCourses({
    userId,
    ...searchParams,
  });
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />
      </div>
    </>
  );
};

export default SearchPage;
