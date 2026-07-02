'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from 'recharts';

type TypeData = {
  name: string;
  total: number;
};

export function TypeChart({
  data,
}: {
  data: TypeData[];
}) {
  return (
    <Card className="rounded-[32px] border-0 shadow-xl transition-colors dark:bg-[#102418] dark:shadow-[0_0_35px_rgba(34,197,94,0.12)]">
      <CardHeader>
        <CardTitle>
          Documents by Type
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[340px]">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="total"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
                fill="#2563eb"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}