import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Chapter, Course, UserProgress } from "@prisma/client";

import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/shared/course-progress";

import { db } from "@/lib/db";

interface Props {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({ course, progressCount }: Props) => {
  const { sessionClaims } = await auth();
  if (!sessionClaims?.sub) return redirect(`/`);

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: sessionClaims.sub,
        courseId: course.id,
      },
    },
  });
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress value={progressCount} varient="success" />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};
