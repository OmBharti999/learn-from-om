"use server";

import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { Course } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { returnError } from "@/lib/utils";

/**
 *
 * @param id -> course id
 * @param data -> data to update
 * @returns -> course
 */
export const updateCourse = async (id: string, data: Partial<Course>) => {
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

export const updateChaptersPosition = async ({
  courseId,
  data,
}: {
  courseId: string;
  data: { id: string; position: number }[];
}) => {
  console.log("🚀 ~ courseId:", courseId);
  try {
    let promises = [];
    for (const item of data) {
      const task = db.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
      promises.push(task);
    }

    const allResponse = await Promise.all(promises);

    // [NOTE] - NO RE-VALIDATIOJN ON PURPOSE
    // No Revalidation as its already updated in UI
    // This will case multiple re-renders

    // revalidatePath(`/teacher/courses/${courseId}`);
    return { allResponse };
  } catch (error) {
    return returnError("Something went wrong");
  }
};

/**
 * This function handles publishing or unpublishing a chapter when the user clicks the respective button on the chapter edit page.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.courseId - The ID of the course to which the chapter belongs.
 * @param {boolean} params.state - The desired publish state of the chapter. True for publish, false for unpublish.
 * @returns {Promise<Chapter | { error: string }>} - Returns the updated chapter object or an error message.
 */

export const publishCourse = async ({
  courseId,
  state = false,
}: {
  courseId: string;
  state: boolean;
}) => {
  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      // include: {
      //   chapters: {
      //     include: {
      //       muxData: {
      //         select: {
      //           assetId: true,
      //         },
      //       },
      //     },
      //   },
      // },
      select: {
        id: true,
        isPublished: true,
        title: true,
        description: true,
        imageUrl: true,
        categoryId: true,
        chapters: {
          select: {
            muxData: {
              select: {
                assetId: true,
              },
            },
            isPublished: true,
          },
        },
      },
    });
    if (!course) {
      return returnError("Course not found");
    }

    let publishedCourse: Course | null = null;
    if (!state) {
      // console.log("$$$ UNPUBLISHING $$$");
      // UNPUBLISH PART NO NEED TO CHECK DIRECTLY MAKE IT UNPUBLISH
      publishedCourse = await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: state,
        },
      });
    } else {
      const hasPublishedChapter = course.chapters.some(
        (chapter) => chapter.isPublished
      );
      if (
        !course?.title ||
        !course?.description ||
        !course?.imageUrl ||
        !course?.categoryId ||
        !hasPublishedChapter
      ) {
        return returnError("Missing required fields");
      }
      // console.log("--- PUBLISHING ---");

      publishedCourse = await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: state,
        },
      });
    }
    revalidatePath(`/teacher/courses/${courseId}`);
    return publishedCourse;
  } catch (error) {
    return returnError("Something went wrong");
  }
};

// deleteCourse

export const deleteCourse = async ({ courseId }: { courseId: string }) => {
  console.log("🚀 ~ deleteCourse ~ courseId:", courseId);
  try {
    const { video } = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          include: {
            muxData: {
              select: {
                assetId: true,
              },
            },
          },
        },
      },
    });
    console.log("🚀 ~ deleteCourse ~ course:", course);

    if (!course) {
      return returnError("Course not found");
    }

    const muxPromises: Promise<any>[] = [];
    course?.chapters?.forEach(async (chapter) => {
      if (chapter?.muxData?.assetId) {
        await video.assets.delete(chapter?.muxData?.assetId);
      }
    });
    // Waiting for all mux data delete
    // try {
    //   await Promise.all(muxPromises);
    // } catch (error) {
    //   console.log("PROMISE ERROR", error);
    // }

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
      },
    });
    revalidatePath(`/teacher/courses/${courseId}`);
    return deletedCourse;
  } catch (error) {
    return returnError("Something went wrong");
  }
};
