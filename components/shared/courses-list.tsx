import { Category, Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};
interface Props {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: Props) => {
  return (
    <div>
      {items.map((item) => (
        <div className="" key={item.id}>
          {item.title}
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  );
};
