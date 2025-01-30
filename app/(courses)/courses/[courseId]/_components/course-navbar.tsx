import { NavbarRoutes } from "@/components/shared/navbar-routes";
import { Chapter, Course, UserProgress } from "@prisma/client";

interface Props {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[];
  };
  progressCount: number;
}
export const CourseNavbar = ({ course, progressCount }: Props) => {
  return (
    <div className="p-4 border-b h-full items-center flex bg-white shadow-sm">
      <NavbarRoutes />
    </div>
  );
};
