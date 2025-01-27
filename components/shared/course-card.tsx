import Image from "next/image";
import Link from "next/link";

import { IconBadge } from "@/components/shared/icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface Props {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string | null;
}

export const CourseCard = ({
  category,
  chaptersLength,
  id,
  imageUrl,
  price,
  progress,
  title,
}: Props) => {
  return (
    <Link href={`/course/${id}`}>
      <div className="group relative transition overflow-hidden rounded-lg p-3 h-full border border-transparent hover:shadow-sm">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image src={imageUrl} fill alt={title} className="object-cover" />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge icon={BookOpen} size="sm" />
              <span>
                {chaptersLength} Chapter{chaptersLength === 1 ? "" : "s"}
              </span>
            </div>
          </div>
          {
            progress !== null ? (
              <div className=""
              >
                todd progress compoent
              </div>
            ):
            (
              <p className="text-md md:text-sm font-medium text-slate-700">
                {
                  formatPrice(price)
                }
              </p>
            )
          }
        </div>
      </div>
    </Link>
  );
};
