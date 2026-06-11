'use client';

import { format } from 'date-fns';

import {
  CalendarDays,
  Clock3,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Calendar } from '@/components/ui/calendar';

import { Input } from '@/components/ui/input';

interface DateTimePickerProps {
  value?: Date;

  onChange: (
    date: Date | undefined
  ) => void;

  placeholder?: string;

  disabled?: boolean;
}

export function DateTimePicker({
  value,

  onChange,

  placeholder = 'Select date & time',

  disabled = false,
}: DateTimePickerProps) {
  /*
   |--------------------------------------------------
   | HANDLE DATE
   |--------------------------------------------------
   */

  const handleDateSelect = (
    date: Date | undefined
  ) => {
    if (!date) {
      onChange(undefined);

      return;
    }

    const currentDate =
      value || new Date();

    date.setHours(
      currentDate.getHours()
    );

    date.setMinutes(
      currentDate.getMinutes()
    );

    onChange(date);
  };

  /*
   |--------------------------------------------------
   | HANDLE TIME
   |--------------------------------------------------
   */

  const handleTimeChange = (
    time: string
  ) => {
    const [hours, minutes] =
      time.split(':');

    const updatedDate =
      value || new Date();

    updatedDate.setHours(
      Number(hours)
    );

    updatedDate.setMinutes(
      Number(minutes)
    );

    onChange(
      new Date(updatedDate)
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-12 w-full justify-start rounded-2xl border-slate-200 bg-slate-50 text-left font-normal hover:bg-slate-100"
        >
          <CalendarDays className="mr-3 h-5 w-5 text-slate-500" />

          {value ? (
            <span className="flex items-center gap-2">
              <span>
                {format(
                  value,
                  'PPP'
                )}
              </span>

              <span className="text-slate-400">
                |
              </span>

              <span className="flex items-center gap-1 text-slate-600">
                <Clock3 className="h-4 w-4" />

                {format(
                  value,
                  'p'
                )}
              </span>
            </span>
          ) : (
            <span className="text-slate-400">
              {placeholder}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto rounded-3xl border border-slate-200 p-4 shadow-2xl"
        align="start"
      >
        <div className="space-y-4">
          {/* CALENDAR */}
          <Calendar
            mode="single"
            selected={value}
            onSelect={
              handleDateSelect
            }
          />

          {/* TIME */}
          <div className="border-t border-slate-200 pt-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock3 className="h-4 w-4" />

              Select Time
            </label>

            <Input
              type="time"
              value={
                value
                  ? `${String(
                      value.getHours()
                    ).padStart(
                      2,
                      '0'
                    )}:${String(
                      value.getMinutes()
                    ).padStart(
                      2,
                      '0'
                    )}`
                  : ''
              }
              onChange={(e) =>
                handleTimeChange(
                  e.target.value
                )
              }
              className="h-11 rounded-2xl border-slate-200 bg-slate-50"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}