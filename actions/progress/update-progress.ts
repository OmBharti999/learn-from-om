"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { returnError } from "@/lib/utils";

export const updateProgress = async ({
  chapterId,
  isCompleted,
  courseId,
}: {
  chapterId: string;
  courseId: string;
  isCompleted: boolean;
}) => {
  try {
    const { userId } = await auth();
    if (!userId) return returnError("Unauthorized");

    const updatedProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          chapterId,
          userId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        chapterId,
        userId,
        isCompleted,
      },
    });
    revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
    return updatedProgress;
  } catch (error) {
    console.error(
      "🚀 ~ file: update-progress.ts:4 ~ updateProgress ~ error:",
      error
    );
    return returnError("Internal server error");
  }
};
