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

type StatusItem = {
  name: string;
  value: number;
};

type Props = {
  data: StatusItem[];
};

const COLORS = [
  '#16a34a',
  '#2563eb',
  '#f59e0b',
  '#dc2626',
  '#7c3aed',
  '#0ea5e9',
];

export function StatusChart({
  data,
}: Props) {

  console.log('status-chart:', data)

  return (
    <Card className="rounded-[32px] border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-black text-[#102418]">
          Documents by Status
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
                paddingAngle={4}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}