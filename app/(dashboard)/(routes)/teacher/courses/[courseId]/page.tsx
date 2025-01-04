const CourseIdPage = ({
  params: { courseId },
}: {
  params: { courseId: string };
}) => {
  return <div>CourseIdPage : {courseId}</div>;
};

export default CourseIdPage;
