interface Props {
  varient?: "default" | "success";
  value: number;
  size?: "default" | "sm";
}

const colorByVarient = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVarient = {
  default: "text-sm",
  success: "text-xs",
};

export const CourseProgress = ({ value, varient, size }: Props) => {
  return <div>
    {
        
    }
  </div>;
};
