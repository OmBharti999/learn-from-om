import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { columns, DataTable } from "./_components";
import { db } from "@/lib/db";

const CoursesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      {/* <Button asChild>
        <Link href={`/teacher/create`}>New Course</Link>
      </Button> */}
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
