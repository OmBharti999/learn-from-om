import Link from "next/link";
import { File } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Banner } from "@/components/shared/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/shared/preview";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";

import { getChapters } from "@/actions/chapters/get-chapters";

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{ chapterId: string; courseId: string }>;
}) => {
  const { chapterId, courseId } = await params;
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.sub;

  if (!userId) {
    return redirect("/");
  }

  const {
    attachments,
    chapter,
    course,
    userProgress,
    muxData,
    nextChapter,
    purchase,
  } = await getChapters({ chapterId, courseId, userId });

  if (!chapter || !course) {
    return redirect(`/`);
  }

  const isLocked = !chapter.isFree && !purchase;

  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          label="You already completed this chapter"
          varient={"success"}
        />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase this course to access this chapter"
          varient={"warning"}
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            courseId={courseId}
            chapterId={chapterId}
            title={chapter.title}
            nextChapter={nextChapter?.id}
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="">
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl mb-2 font-semibold">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>
          <Separator />
          <div className="">
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map(({ id, url, name }) => (
                  <Link
                    href={url}
                    target="_blank"
                    className="text-sky-700 bg-sky-200 flex items-center border p-3 w-full rounded-md hover:underline"
                    key={id}
                  >
                    <File />
                    <p className="line-clamp-1">{name}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
