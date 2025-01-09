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

export const addAttachment = async (
  courseId: string,
  attachmentUrl: string
) => {
  try {
    const course = await db.attachment.create({
      data: {
        url: attachmentUrl,
        courseId,
        name: attachmentUrl.split("/").pop()!,
      },
    });
    revalidatePath(`/teacher/courses/${courseId}`);
    return course;
  } catch (error) {
    return returnError("Something went wrong");
  }
};

export const deleteAttachment = async (attachmentId: string) => {
  try {
    const attachment = await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });
    revalidatePath(`/teacher/courses/${attachment.courseId}`);
    return attachment;
  } catch (error) {
    return returnError("Something went wrong");
  }
};

export const createChapter = async (courseId: string, data: any) => {
  let lastChapter;
  try {
    lastChapter = await db.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: "desc",
      },
    });
  } catch (error) {
    return returnError("Something went wrong");
  }
  const position = lastChapter ? lastChapter.position + 1 : 1;
  try {
    const chapter = await db.chapter.create({
      data: {
        courseId,
        title: data.title,
        position,
      },
    });
    revalidatePath(`/teacher/courses/${courseId}`);
    return chapter;
  } catch (error) {
    return returnError("Something went wrong");
  }
};
