import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      varient: {
        warning: "border-yellow-300 text-primary bg-yellow-200/80",
        success: "border-emerald-800 text-secondary bg-emerald-700",
      },
    },
    defaultVariants: {
      varient: "warning",
    },
  }
);

interface Props extends VariantProps<typeof bannerVariants> {
  label: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};
export const Banner = ({ label, varient }: Props) => {
  const Icon = iconMap[varient ?? "warning"];

  return (
    <div className={cn(bannerVariants({ varient }))}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  );
};
