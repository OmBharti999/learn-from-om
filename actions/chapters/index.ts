"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Chapter } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateChapter = async ({
  chapterId,
  courseId,
  values,
}: {
  courseId: string;
  chapterId: string;
  values: Partial<Chapter>;
}) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return returnError("Unauthorized");
    }
    const { isPublished, ...data } = values;
    const course = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data,
    });

    if (!course) {
      return returnError("Course not found");
    }

    revalidatePath(`/teacher/courses/${courseId}/chapters/${chapterId}`);
    return course;
  } catch (error) {
    return returnError("Something went wrong");
  }
};
