"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 *
 * @param id -> course id
 * @param data -> data to update
 * @returns -> course
 */
export const updateCourse = async (id: string, data: any) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return returnError("Unauthorized");
    }

    const course = await db.course.update({
      where: {
        id,
        userId,
      },
      data,
    });

    if (!course) {
      return returnError("Course not found");
    }

    revalidatePath(`/teacher/courses/${id}`);
    return course;
  } catch (error) {
    return returnError("Something went wrong");
  }
};
