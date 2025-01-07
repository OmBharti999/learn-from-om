"use client";

import { z } from "zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { updateCourse } from "@/actions/courses";
import { cn } from "@/lib/utils";

import type { Course } from "@prisma/client";

interface Props {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z
    .string()
    .min(1, {
      message: "Image is required",
    })
    .optional(),
});

export const ImageForm = ({ courseId, initialData }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { imageUrl: initialData.imageUrl ?? undefined },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log("🚀 ~ onSubmit ~ values:", values);
    try {
      const course = await updateCourse(courseId, values);
      if ((course as { error: string })?.error)
        toast.error((course as { error: string }).error);
      else {
        toast.success("Course updated");
        toggleEditing();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button variant={`ghost`} onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'This course is about...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <p
          className={cn(`text-sm mt-2`, {
            "text-slate-500 italic": !initialData.description,
          })}
        >
          {initialData.imageUrl ?? "No description"}
        </p>
      )}
    </div>
  );
};
