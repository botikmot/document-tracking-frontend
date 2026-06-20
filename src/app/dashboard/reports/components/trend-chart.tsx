'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

type TrendData = {
  month: string;
  created: number;
  completed: number;
};

type Props = {
  data: TrendData[];
};

export function TrendChart({
  data,
}: Props) {
  return (
    <Card className="rounded-3xl border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-black">
          Monthly Document Trend
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[380px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="4 4" />

              <XAxis
                dataKey="month"
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="created"
                stroke="#2563eb"
                strokeWidth={4}
                dot={{
                  r: 4,
                }}
                activeDot={{
                  r: 7,
                }}
                name="Created"
              />

              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={4}
                dot={{
                  r: 4,
                }}
                activeDot={{
                  r: 7,
                }}
                name="Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}