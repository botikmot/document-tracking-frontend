'use client';

import {
  CalendarDays,
  Filter,
  RotateCcw,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import {
  Input,
} from '@/components/ui/input';

type TransactionsDateRangeProps = {
  from: string;
  to: string;

  onFromChange: (
    value: string,
  ) => void;

  onToChange: (
    value: string,
  ) => void;

  onApply: () => void;

  onClear: () => void;

  disabled?: boolean;
};

export function TransactionsDateRange({
  from,
  to,
  onFromChange,
  onToChange,
  onApply,
  onClear,
  disabled = false,
}: TransactionsDateRangeProps) {
  const hasDate =
    Boolean(from || to);

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        dark:border-[#214234]
        dark:bg-[#102418]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          xl:flex-row
          xl:items-end
          xl:justify-between
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays
              className="
                h-4
                w-4
                text-emerald-600
              "
            />

            <p
              className="
                text-sm
                font-bold
                text-[#102418]
                dark:text-[#F3F8F3]
              "
            >
              Reporting Period
            </p>
          </div>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
              dark:text-[#A9C5B6]
            "
          >
            Filter transactions by
            official received date.
          </p>
        </div>

        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-end
          "
        >
          {/* FROM */}

          <div className="space-y-1.5">
            <label
              htmlFor="transaction-from"
              className="
                text-xs
                font-semibold
                text-slate-500
                dark:text-[#A9C5B6]
              "
            >
              From
            </label>

            <Input
              id="transaction-from"
              type="date"
              value={from}
              disabled={disabled}
              onChange={(event) =>
                onFromChange(
                  event.target.value,
                )
              }
              className="
                h-11
                min-w-[180px]
                rounded-xl
                dark:border-[#214234]
                dark:bg-[#173227]
                dark:text-[#F3F8F3]
              "
            />
          </div>

          {/* TO */}

          <div className="space-y-1.5">
            <label
              htmlFor="transaction-to"
              className="
                text-xs
                font-semibold
                text-slate-500
                dark:text-[#A9C5B6]
              "
            >
              To
            </label>

            <Input
              id="transaction-to"
              type="date"
              value={to}
              disabled={disabled}
              onChange={(event) =>
                onToChange(
                  event.target.value,
                )
              }
              className="
                h-11
                min-w-[180px]
                rounded-xl
                dark:border-[#214234]
                dark:bg-[#173227]
                dark:text-[#F3F8F3]
              "
            />
          </div>

          {/* APPLY */}

          <Button
            type="button"
            disabled={disabled}
            onClick={onApply}
            className="
              h-11
              cursor-pointer
              rounded-xl
              bg-[#102418]
              px-5
              text-white
              hover:bg-[#173227]
              dark:bg-emerald-600
              dark:hover:bg-emerald-500
            "
          >
            <Filter className="mr-2 h-4 w-4" />

            Apply
          </Button>

          {/* CLEAR */}

          <Button
            type="button"
            variant="outline"
            disabled={
              disabled ||
              !hasDate
            }
            onClick={onClear}
            className="
              h-11
              cursor-pointer
              rounded-xl
              dark:border-[#214234]
              dark:bg-[#173227]
              dark:text-[#F3F8F3]
            "
          >
            <RotateCcw className="mr-2 h-4 w-4" />

            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}