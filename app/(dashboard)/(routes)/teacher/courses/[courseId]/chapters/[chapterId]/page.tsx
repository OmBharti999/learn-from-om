const ChapterEditPage = async ({
  params,
}: {
  params: { chapterId: string };
}) => {
  // await is needed getting warning about asynchronous access of `params.courseId`
  const { chapterId } = await params;
  return <div>ChapterEditPage</div>;
};

export default ChapterEditPage;
