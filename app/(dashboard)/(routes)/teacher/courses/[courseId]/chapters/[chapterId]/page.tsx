import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import { redirect } from "next/navigation";

import { IconBadge } from "@/components/shared/icon-badge";

import {
  AccessForm,
  ChapterActions,
  DescriptionForm,
  TitleForm,
  VideoForm,
} from "./_components";

import { db } from "@/lib/db";
import { Banner } from "@/components/shared/banner";

const ChapterEditPage = async ({
  params,
}: {
  params: Promise<{ chapterId: string; courseId: string }>;
}) => {
  // await is needed getting warning about asynchronous access of `params.courseId`
  const { chapterId, courseId } = await params;
  // const { userId } = await auth();
  const chapter = await db.chapter.findUnique({
    where: { id: chapterId, courseId },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields}/${totalFields}`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          varient={"warning"}
          label="This chapter is unpublished. It will not be visible in the course."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${courseId}`}
              className="flex items-center text-sm hover:opacaity-75 mb-6 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-col-2 md:grid-cols-2 gap-6  mt-16">
          <div className="space-y-4">
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <TitleForm
                chapterId={chapterId}
                initialData={chapter}
                courseId={courseId}
              />
              <DescriptionForm
                chapterId={chapterId}
                initialData={chapter}
                courseId={courseId}
              />
            </div>
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <AccessForm
                chapterId={chapterId}
                courseId={courseId}
                initialData={chapter}
              />
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <VideoForm
              chapterId={chapterId}
              courseId={courseId}
              initialData={chapter}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterEditPage;
