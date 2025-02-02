import { IconBadge } from "@/components/shared/icon-badge";
import { LucideIcon } from "lucide-react";
import React from "react";

interface Props {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "success";
}

export const InfoCard = ({
  icon: Icon,
  label,
  numberOfItems,
  variant,
}: Props) => {
  return (
    <div className="border rounded-md p-3 flex items-center gap-x-2">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-gray-500">
          {numberOfItems} Course{numberOfItems === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
};
