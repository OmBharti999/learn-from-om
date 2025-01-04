import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params: { courseId },
}: {
  params: { courseId: string };
}) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect(`/`);
  }
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (
    !course
    // || course.userId !== userId
  ) {
    return redirect(`/`);
  }

  const requieredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requieredFields.length;
  const completedFields = requieredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 ">
        <h2 className="text-xl">Customize your course</h2>
      </div>
    </div>
  );
};

export default CourseIdPage;
