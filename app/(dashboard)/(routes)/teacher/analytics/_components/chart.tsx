"use client";

import { Card } from "@/components/ui/card";

interface Props {
  data: {
    name: string;
    total: number;
  }[];
}

export const Chart = ({ data }: Props) => {
  return <Card>
    CHART COMPOENENT
  </Card>;
};
