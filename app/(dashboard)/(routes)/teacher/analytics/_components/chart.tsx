"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/card";

interface Props {
  data: {
    name: string;
    total: number;
  }[];
}

export const Chart = ({ data }: Props) => {
  return (
    <Card>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey={"name"}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            // dataKey={"name"}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar dataKey={"total"} fill="#0369a1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
