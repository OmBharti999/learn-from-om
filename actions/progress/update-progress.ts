"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export const updateProgress = async ({
  chapterId,
  isCompleted,
//   courseId,
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

    return updatedProgress;
  } catch (error) {
    console.error(
      "🚀 ~ file: update-progress.ts:4 ~ updateProgress ~ error:",
      error
    );
    return returnError("Internal server error");
  }
};
