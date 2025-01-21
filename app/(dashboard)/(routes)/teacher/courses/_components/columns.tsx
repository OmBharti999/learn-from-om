"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Course } from "@prisma/client";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "isPublished",
    header: "Published",
  },
];
