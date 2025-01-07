import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  courseAttachments: f(["image", "text", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  // Define as many FileRoutes as you like, each with a unique routeSlug
  //   imageUploader: f({
  //     image: {
  //       /**
  //        * For full list of options and defaults, see the File Route API reference
  //        * @see https://docs.uploadthing.com/file-routes#route-config
  //        */
  //       maxFileSize: "4MB",
  //       maxFileCount: 1,
  //     },
  //   })
  //     // Set permissions and file types for this FileRoute
  //     .middleware(async ({ req }) => {
  //       // This code runs on your server before upload
  //       const user = await auth(req);

  //       // If you throw, the user will not be able to upload
  //       if (!user) throw new UploadThingError("Unauthorized");

  //       // Whatever is returned here is accessible in onUploadComplete as `metadata`
  //       return { userId: user.id };
  //     })
  //     .onUploadComplete(async ({ metadata, file }) => {
  //       // This code RUNS ON YOUR SERVER after upload
  //       console.log("Upload complete for userId:", metadata.userId);

  //       console.log("file url", file.url);

  //       // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
  //       return { uploadedBy: metadata.userId };
  //     }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
