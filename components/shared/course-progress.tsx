import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const colorByVarient = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVarient = {
  default: "text-sm",
  sm: "text-xs",
};

interface Props {
  varient?: "default" | "success";
  value: number;
  size?: "default" | "sm";
}
export const CourseProgress = ({ value, varient, size }: Props) => {
  return (
    <div>
      <Progress className="h-2" value={value} variant={varient} />
      <p
        className={cn(
          "font-medium text-sky-700 mt-2",
          colorByVarient[varient || "default"],
          sizeByVarient[size || "default"]
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};
