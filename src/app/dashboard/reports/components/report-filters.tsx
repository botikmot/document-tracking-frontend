'use client';

import {
  CalendarDays,
  FileBarChart2,
  RotateCcw,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type {
  ReportFilters as ReportFiltersType,
} from '@/types/report';

type Props = {
  filters: ReportFiltersType;

  setFilters: React.Dispatch<
    React.SetStateAction<ReportFiltersType>
  >;

  loading: boolean;

  onGenerate: () => Promise<void>;
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function ReportFilters({
  filters,
  setFilters,
  loading,
  onGenerate,
}: Props) {
  const currentYear =
    new Date().getFullYear();

  const resetFilters = () => {
    setFilters({
      type: 'monthly',
      month:
        new Date().getMonth() + 1,
      quarter: 1,
      year: currentYear,
    });
  };

  return (
    <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl">
      <CardContent className="p-8">

        {/* Header */}

        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
              <FileBarChart2 className="h-7 w-7 text-indigo-600" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#102418]">
                Reports Generator
              </h2>

              <p className="text-slate-500">
                Generate document tracking analytics and export reports.
              </p>
            </div>
          </div>

          <div className="hidden rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 md:block">
            Analytics Report
          </div>
        </div>

        {/* Filters */}

        <div className="grid gap-4 lg:grid-cols-12">

          {/* Report Type */}

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold">
              Report Type
            </label>

            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  type:
                    value as ReportFiltersType['type'],
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="monthly">
                  Monthly
                </SelectItem>

                <SelectItem value="quarterly">
                  Quarterly
                </SelectItem>

                <SelectItem value="annual">
                  Annual
                </SelectItem>

                <SelectItem value="custom">
                  Custom
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Year */}

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold">
              Year
            </label>

            <Input
              type="number"
              value={filters.year}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  year: Number(
                    e.target.value,
                  ),
                }))
              }
            />
          </div>

          {/* Monthly */}

          {filters.type ===
            'monthly' && (
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Month
              </label>

              <Select
                value={String(
                  filters.month,
                )}
                onValueChange={(
                  value,
                ) =>
                  setFilters(
                    (prev) => ({
                      ...prev,
                      month:
                        Number(
                          value,
                        ),
                    }),
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {MONTHS.map(
                    (
                      month,
                      index,
                    ) => (
                      <SelectItem
                        key={
                          month
                        }
                        value={String(
                          index +
                            1,
                        )}
                      >
                        {month}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quarterly */}

          {filters.type ===
            'quarterly' && (
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Quarter
              </label>

              <Select
                value={String(
                  filters.quarter,
                )}
                onValueChange={(
                  value,
                ) =>
                  setFilters(
                    (prev) => ({
                      ...prev,
                      quarter:
                        Number(
                          value,
                        ),
                    }),
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1">
                    Q1
                  </SelectItem>

                  <SelectItem value="2">
                    Q2
                  </SelectItem>

                  <SelectItem value="3">
                    Q3
                  </SelectItem>

                  <SelectItem value="4">
                    Q4
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Custom Dates */}

          {filters.type ===
            'custom' && (
            <>
              <div className="lg:col-span-3">
                <label className="mb-2 block text-sm font-semibold">
                  Start Date
                </label>

                <Input
                  type="date"
                  value={
                    filters.startDate ??
                    ''
                  }
                  onChange={(e) =>
                    setFilters(
                      (
                        prev,
                      ) => ({
                        ...prev,
                        startDate:
                          e.target
                            .value,
                      }),
                    )
                  }
                />
              </div>

              <div className="lg:col-span-3">
                <label className="mb-2 block text-sm font-semibold">
                  End Date
                </label>

                <Input
                  type="date"
                  value={
                    filters.endDate ??
                    ''
                  }
                  onChange={(e) =>
                    setFilters(
                      (
                        prev,
                      ) => ({
                        ...prev,
                        endDate:
                          e.target
                            .value,
                      }),
                    )
                  }
                />
              </div>
            </>
          )}

          {/* Buttons */}

          <div className="flex items-end justify-end gap-3 lg:col-span-4">

            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={resetFilters}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              type="button"
              disabled={loading}
              onClick={() => {
                void onGenerate();
              }}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600"
            >
              <Search className="mr-2 h-4 w-4" />

              {loading
                ? 'Generating...'
                : 'Generate Report'}
            </Button>
          </div>
        </div>

        {/* Footer Info */}

        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <CalendarDays className="h-4 w-4" />

          Reporting Period:
          <span className="font-semibold text-slate-900">
            {filters.type ===
              'monthly' &&
              `${MONTHS[(filters.month ?? 1) - 1]} ${filters.year}`}

            {filters.type ===
              'quarterly' &&
              `Q${filters.quarter} ${filters.year}`}

            {filters.type ===
              'annual' &&
              filters.year}

            {filters.type ===
              'custom' &&
              `${filters.startDate ?? '-'} → ${filters.endDate ?? '-'}`}
          </span>
        </div>

      </CardContent>
    </Card>
  );
}