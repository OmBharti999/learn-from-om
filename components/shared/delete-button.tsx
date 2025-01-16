"use client";

import { X } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  onClick: () => void;
}

export const DeleteButton = ({ onClick }: Props) => {
  return (
    <Button
      variant="ghost"
      className="ml-auto hover:opacity-75 transition"
      size="sm"
      onClick={onClick}
    >
      <X className="h-4 w-4" />
    </Button>
  );
};
