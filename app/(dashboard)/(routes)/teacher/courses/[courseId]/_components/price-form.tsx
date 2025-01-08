"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { updateCourse } from "@/actions/courses";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number().min(1, {
    message: "Price is required",
  }),
});

export const PriceForm = ({ courseId, initialData }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { price: initialData.price ?? undefined },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log("🚀 ~ onSubmit ~ values:", values);
    try {
      // await axios.patch(`/api/courses/${courseId}`, values);
      const course = await updateCourse(courseId, values);
      // console.log("🚀 ~ onSubmit ~ course:", course);
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
        Course price
        <Button variant={`ghost`} onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Edit price
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Course price
                  </FormLabel> */}
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Set a price for your course"
                      step={0.01}
                      type="number"
                      {...field}
                      // className="bg-zinc-300/50 border-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"
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
          {initialData.price ? formatPrice(initialData.price) : "No price"}
        </p>
      )}
    </div>
  );
};
