import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Banner } from "@/components/shared/banner";
import { VideoPlayer } from "./_components/video-player";

import { getChapters } from "@/actions/chapters/get-chapters";
import { CourseEnrollButton } from "./_components/course-enroll-button";

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
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="">
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl mb-2 font-semibold">{chapter.title}</h2>
            {purchase ? (
              <div className="flex items-center gap-x-2 text-slate-500 text-sm md:text-base ml-auto">
                todo
              </div>
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
