"use client";

import type { Category } from "@prisma/client";
import {
  FcOldTimeCamera,
  FcEngineering,
  FcMusic,
  FcSalesPerformance,
  FcSportsMode,
  FcFilmReel,
  FcMultipleDevices,
} from "react-icons/fc";
import { IconType } from "react-icons/lib";
import { CategoryItem } from "./category-item";

interface Props {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Engineering: FcEngineering,
  Accounting: FcSalesPerformance,
  Fitness: FcSportsMode,
  Filming: FcFilmReel,
  "Computer Science": FcMultipleDevices,
};
export const Categories = ({ items }: Props) => {
  return (
    <div className="flex gap-x-2 items-center overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};
