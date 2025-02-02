"use client";

import { purchaseCheckout } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}
export const CourseEnrollButton = ({
  courseId,
  price,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await purchaseCheckout({ courseId });
      if (typeof response === "string") {
        window.location.assign(response);
      } else if (response?.error) {
        toast.error(response?.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      className="w-full md:w-auto"
      size={"sm"}
      onClick={onClick}
      disabled={isLoading}
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};
