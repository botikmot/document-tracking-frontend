'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';

type Priority = {
  name: string;
  value: number;
};

const COLORS = [
  '#dc2626',
  '#f59e0b',
  '#16a34a',
  '#2563eb',
];

export function PriorityChart({
  data,
}: {
  data: Priority[];
}) {
  return (
    <Card className="rounded-[32px] border-0 shadow-xl transition-colors dark:bg-[#102418] dark:shadow-[0_0_35px_rgba(34,197,94,0.12)]">
      <CardHeader>
        <CardTitle>
          Priority Distribution
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[340px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={120}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      COLORS[
                        i %
                          COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Legend />

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}