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

type OfficeRanking = {
  office: string;
  total: number;
};

export function OfficeRankingChart({
  data,
}: {
  data: OfficeRanking[];
}) {
  return (
    <Card className="rounded-[32px] border-0 shadow-xl">
      <CardHeader>
        <CardTitle>
          Office Ranking
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[420px]">
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={data}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                type="number"
              />

              <YAxis
                type="category"
                dataKey="office"
                width={130}
              />

              <Tooltip />

              <Bar
                dataKey="total"
                fill="#16a34a"
                radius={[
                  0,
                  10,
                  10,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}