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

import { useDocumentTypes } from '../hooks/useDocumentTypes';

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
      documentTypeId: undefined,
      status: undefined,
    });
  };

  const documentTypes = useDocumentTypes();

  return (
    <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-xl transition-colors dark:bg-[#102418] dark:shadow-[0_0_35px_rgba(34,197,94,0.12)]">
      <CardContent className="p-8">

        {/* Header */}

        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 transition-colors dark:from-blue-900/30 dark:to-indigo-900/30">
              <FileBarChart2 className="h-7 w-7 text-indigo-600 dark:text-indigo-300" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#102418] dark:text-[#F3F8F3]">
                Reports Generator
              </h2>

              <p className="text-slate-500 dark:text-[#A9C5B6]">
                Generate document tracking analytics and export reports.
              </p>
            </div>
          </div>

          <div className="hidden rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors dark:bg-green-900/30 dark:text-green-300 md:block">
            Analytics Report
          </div>
        </div>

        {/* Filters */}

        <div className="grid gap-4 lg:grid-cols-12">

          {/* Report Type */}

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
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
              <SelectTrigger className="w-full border-slate-200 bg-white transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="border-slate-200 bg-white dark:border-[#214234] dark:bg-[#102418]">
                <SelectItem className="cursor-pointer dark:text-[#F3F8F3] dark:focus:bg-[#173227] dark:focus:text-white" value="monthly">
                  Monthly
                </SelectItem>

                <SelectItem className="cursor-pointer dark:text-[#F3F8F3] dark:focus:bg-[#173227] dark:focus:text-white" value="quarterly">
                  Quarterly
                </SelectItem>

                <SelectItem className="cursor-pointer dark:text-[#F3F8F3] dark:focus:bg-[#173227] dark:focus:text-white" value="annual">
                  Annual
                </SelectItem>

                {/* <SelectItem value="custom">
                  Custom
                </SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
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
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
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
                <SelectTrigger className="w-full border-slate-200 bg-white transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="border-slate-200 bg-white dark:border-[#214234] dark:bg-[#102418]">
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
                         className="cursor-pointer dark:text-[#F3F8F3] dark:focus:bg-[#173227] dark:focus:text-white"
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
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
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
                <SelectTrigger className="w-full border-slate-200 bg-white transition-colors dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="border-slate-200 bg-white dark:border-[#214234] dark:bg-[#102418]">
                  <SelectItem className="cursor-pointer dark:text-[#F3F8F3] dark:focus:bg-[#173227] dark:focus:text-white" value="1">
                    Q1
                  </SelectItem>

                  <SelectItem className="cursor-pointer dark:text-[#F3F8F3] dark:focus:bg-[#173227] dark:focus:text-white" value="2">
                    Q2
                  </SelectItem>

                  <SelectItem className="cursor-pointer dark:text-[#F3F8F3] dark:focus:bg-[#173227] dark:focus:text-white" value="3">
                    Q3
                  </SelectItem>

                  <SelectItem className="cursor-pointer dark:text-[#F3F8F3] dark:focus:bg-[#173227] dark:focus:text-white" value="4">
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
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
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
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
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
              className="rounded-xl cursor-pointer dark:border-[#214234] dark:bg-[#173227] dark:text-[#F3F8F3] dark:hover:bg-[#214234]"
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
              className="rounded-xl cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 transition-all hover:from-green-700 hover:to-emerald-700 dark:shadow-[0_0_20px_rgba(34,197,94,0.25)]"
            >
              <Search className="mr-2 h-4 w-4" />

              {loading
                ? 'Generating...'
                : 'Generate Report'}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#D7E8DD]">
              Document Type
            </label>

            <Select
              value={filters.documentTypeId ?? 'ALL'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  documentTypeId:
                    value === 'ALL'
                      ? undefined
                      : value,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="ALL">
                  All Document Types
                </SelectItem>

                {documentTypes.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                  >
                    {type.name}
                  </SelectItem>
                ))}

              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm text-slate-700 dark:text-[#D7E8DD] font-semibold">
              Status
            </label>

            <Select
              value={filters.status ?? 'ALL'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status:
                    value === 'ALL'
                      ? undefined
                      : value,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="ALL">
                  All Status
                </SelectItem>

                <SelectItem value="DRAFT">
                  Draft
                </SelectItem>

                <SelectItem value="PENDING">
                  Pending
                </SelectItem>

                <SelectItem value="FOR_REVIEW">
                  For Review
                </SelectItem>

                <SelectItem value="FOR_APPROVAL">
                  For Approval
                </SelectItem>

                <SelectItem value="ON_PROCESS">
                  On Process
                </SelectItem>

                <SelectItem value="COMPLETED">
                  Completed
                </SelectItem>

                {/* <SelectItem value="REJECTED">
                  Rejected
                </SelectItem> */}

              </SelectContent>
            </Select>
          </div>

        </div>

        {/* Footer Info */}

        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 transition-colors dark:bg-[#173227] dark:text-[#A9C5B6]">
          <CalendarDays className="h-4 w-4 text-slate-500 dark:text-[#A9C5B6]" />

          Reporting Period:
          <span className="font-semibold text-slate-900 dark:text-[#F3F8F3]">
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