"use server";

import { db } from "@/lib/db";

export const getProgress = async ({
  courseId,
  userId,
}: {
  userId: string;
  courseId: string;
}): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChaptersIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChaptersIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapters.length) * 100;
    return progressPercentage;
  } catch (error) {
    console.log("🚀 ~ getProgress ~ error:", error);
    return 0;
  }
};
