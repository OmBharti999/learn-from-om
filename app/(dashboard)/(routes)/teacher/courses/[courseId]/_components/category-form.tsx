"use client";

import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Pencil } from "lucide-react";

import { updateCourse } from "@/actions/courses";
import { cn } from "@/lib/utils";

interface Props {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z
    .string()
    .min(1, {
      message: "Category is required",
    })
    .optional(),
});

export const CategoryForm = ({ courseId, initialData, options }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: initialData.categoryId ?? undefined },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button variant={`ghost`} onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Edit category
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field}  />
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
            "text-slate-500 italic": !initialData.categoryId,
          })}
        >
          {selectedOption?.label ?? "No category"}
        </p>
      )}
    </div>
  );
};
