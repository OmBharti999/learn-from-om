import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  columns,
  DataTable,
} from "@/app/(dashboard)/(routes)/teacher/courses/_components";
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
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
