import { getProgress } from "@/actions/progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { sessionClaims } = await auth();
  if (!sessionClaims?.sub) return redirect(`/`);

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: sessionClaims?.sub,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect(`/`);

  const progressCount = await getProgress({
    courseId,
    userId: sessionClaims.sub,
  });
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 z-50 w-full">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <div className="md:pl-80 pt-[80px] h-full">{children}</div>
    </div>
  );
}
