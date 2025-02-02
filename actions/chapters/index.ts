"use server";

import { auth } from "@clerk/nextjs/server";
import { Chapter } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Mux from "@mux/mux-node";

import { db } from "@/lib/db";
import { returnError } from "@/lib/utils";
import { isTeacher } from "@/lib/teacher";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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
    if (!userId || !isTeacher(userId)) {
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

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      // If user is changing the video, delete the existing asset
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      // This is creating a new asset
      const asset = await video.assets.create({
        input: [{ url: values.videoUrl }],
        playback_policy: ["public"],
        test: false,
      });

      // console.log("asset", asset);

      await db.muxData.create({
        data: {
          assetId: asset.id,
          chapterId,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    revalidatePath(`/teacher/courses/${courseId}/chapters/${chapterId}`);
    return course;
  } catch (error) {
    return returnError("Something went wrong");
  }
};

const validPublishedChaptersFixer = async ({
  courseId,
}: {
  courseId: string;
}) => {
  try {
    const isPublishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!isPublishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteChapter = async ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  try {
    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
        courseId,
      },
      include: {
        muxData: {
          select: {
            assetId: true,
          },
        },
      },
    });

    if (!deletedChapter) {
      return returnError("Chapter not found");
    }

    if (deletedChapter?.muxData?.assetId) {
      await video.assets.delete(deletedChapter?.muxData?.assetId);
    }

    await validPublishedChaptersFixer({ courseId });

    revalidatePath(`/teacher/courses/${courseId}`);
    return deletedChapter;
  } catch (error) {
    return returnError("Something went wrong");
  }
};

/**
 * This function handles publishing or unpublishing a chapter when the user clicks the respective button on the chapter edit page.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.chapterId - The ID of the chapter to be published or unpublished.
 * @param {string} params.courseId - The ID of the course to which the chapter belongs.
 * @param {boolean} params.state - The desired publish state of the chapter. True for publish, false for unpublish.
 * @returns {Promise<Chapter | { error: string }>} - Returns the updated chapter object or an error message.
 */

export const publishChapter = async ({
  chapterId,
  courseId,
  state = false,
}: {
  chapterId: string;
  courseId: string;
  state: boolean;
}) => {
  try {
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      include: {
        muxData: {
          select: {
            assetId: true,
          },
        },
      },
    });
    let publishedChapter: Chapter | null = null;
    if (!state) {
      // console.log("$$$ UNPUBLISHING $$$"); // UNPUBLISH PART NO NEED TO CHECK DIRECTLY MAKE IT UNPUBLISH
      publishedChapter = await db.chapter.update({
        where: {
          id: chapterId,
          courseId,
        },
        data: {
          isPublished: state,
        },
      });
      await validPublishedChaptersFixer({ courseId });
    } else {
      // console.log("--- PUBLISHING ---");
      if (
        !chapter ||
        !chapter.title ||
        !chapter.description ||
        !chapter.videoUrl ||
        !chapter?.muxData?.assetId
      ) {
        return returnError("Missing required fields");
      }

      publishedChapter = await db.chapter.update({
        where: {
          id: chapterId,
          courseId,
        },
        data: {
          isPublished: state,
        },
      });
    }

    if (!publishedChapter) {
      return returnError("Chapter not found");
    }

    revalidatePath(`/teacher/courses/${courseId}/chapters/${chapterId}`);
    return publishedChapter;
  } catch (error) {
    return returnError("Something went wrong");
  }
};
