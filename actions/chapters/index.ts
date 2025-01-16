"use server";

import { auth } from "@clerk/nextjs/server";
import { Chapter } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Mux from "@mux/mux-node";

import { db } from "@/lib/db";
import { returnError } from "@/lib/utils";

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
          playbackId: asset.playback_ids?.[0].id,
        },
      });
    }

    if (!course) {
      return returnError("Course not found");
    }

    revalidatePath(`/teacher/courses/${courseId}/chapters/${chapterId}`);
    return course;
  } catch (error) {
    return returnError("Something went wrong");
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

    const isPublishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!isPublishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: chapterId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    revalidatePath(`/teacher/courses/${courseId}`);
    return deletedChapter;
  } catch (error) {
    return returnError("Something went wrong");
  }
};
