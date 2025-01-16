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
