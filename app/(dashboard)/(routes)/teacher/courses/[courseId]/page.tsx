import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { IconBadge } from "@/components/shared/icon-badge";
import {
  DescriptionForm,
  TitleForm,
  ImageForm,
  CategoryForm,
  PriceForm,
  AttachmentForm,
  ChapterForm,
  Actions,
} from "./_components";
import { Banner } from "@/components/shared/banner";

import { db } from "@/lib/db";

// const populateCategories = async () => {
//   const categories = await db.category.findMany({
//     orderBy: {
//       name: "asc",
//     },
//   });
//   const category = [
//     {
//       name: "Computer Science",
//     },
//     {
//       name: "Music",
//     },
//     {
//       name: "Fitness",
//     },
//     {
//       name: "Photography",
//     },
//     {
//       name: "Engineering",
//     },
//     {
//       name: "Accounting",
//     },
//     {
//       name: "Filming",
//     },
//   ];

//   if (categories.length === 0) {
//     await db.category.createMany({
//       data: category,
//     });
//   }
// };

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  // await is needed getting warning about asynchronous access of `params.courseId`
  const { courseId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect(`/`);
  }
  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = (
    await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    })
  ).map(({ id, name }) => ({
    label: name,
    value: id,
  }));

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
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requieredFields.length;
  const completedFields = requieredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requieredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          label="This course is unpublished. It will not be visible to students."
          varient="warning"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          {/* add actionsf */}
          <Actions
            courseId={courseId}
            isPublished={course.isPublished}
            disabled={!isComplete}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 ">
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={courseId} />
            <DescriptionForm initialData={course} courseId={courseId} />
            <ImageForm initialData={course} courseId={courseId} />
            <CategoryForm
              initialData={course}
              courseId={courseId}
              options={categories}
            />
          </div>
          <div className="space-y-6">
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChapterForm initialData={course} courseId={courseId} />
            </div>
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell Your Course</h2>
              </div>
              <PriceForm initialData={course} courseId={courseId} />
            </div>
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={courseId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
