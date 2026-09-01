import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/*
|--------------------------------------------------------------------------
| TRANSACTION DATE
|--------------------------------------------------------------------------
*/

export function formatTransactionDate(
  value?: string | null,
) {
  if (!value) {
    return '—';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',

      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(date);
}

/*
|--------------------------------------------------------------------------
| SHORT DATE
|--------------------------------------------------------------------------
*/

export function formatTransactionShortDate(
  value?: string | null,
) {
  if (!value) {
    return '—';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'en-PH',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    },
  ).format(date);
}

/*
|--------------------------------------------------------------------------
| DURATION
|--------------------------------------------------------------------------
*/

export function formatTransactionDuration(
  milliseconds?: number | null,
) {
  if (
    milliseconds === null ||
    milliseconds === undefined
  ) {
    return '—';
  }

  const safeValue =
    Math.max(
      milliseconds,
      0,
    );

  if (
    safeValue <
    60 * 1000
  ) {
    return '<1m';
  }

  const totalMinutes =
    Math.floor(
      safeValue /
        (1000 * 60),
    );

  const days =
    Math.floor(
      totalMinutes /
        1440,
    );

  const hours =
    Math.floor(
      (totalMinutes %
        1440) /
        60,
    );

  const minutes =
    totalMinutes %
    60;

  const parts: string[] =
    [];

  if (days > 0) {
    parts.push(
      `${days}d`,
    );
  }

  if (hours > 0) {
    parts.push(
      `${hours}h`,
    );
  }

  if (
    days === 0 &&
    minutes > 0
  ) {
    parts.push(
      `${minutes}m`,
    );
  }

  return (
    parts.join(' ') ||
    '<1m'
  );
}

/*
|--------------------------------------------------------------------------
| MONITORING CATEGORY
|--------------------------------------------------------------------------
*/

export function formatMonitoringCategory(
  value?: string | null,
) {
  if (!value) {
    return 'General';
  }

  return value
    .replaceAll(
      '_',
      ' ',
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}


/*
|--------------------------------------------------------------------------
| DATE INPUT VALUE
|--------------------------------------------------------------------------
*/

export function toTransactionDateInputValue(
  date: Date,
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(
      2,
      '0',
    );

  const day =
    String(
      date.getDate(),
    ).padStart(
      2,
      '0',
    );

  return `${year}-${month}-${day}`;
}

/*
|--------------------------------------------------------------------------
| DEFAULT REPORTING PERIOD
|--------------------------------------------------------------------------
|
| Last 30 calendar days including today.
|
| Example:
| Aug 03 → Sep 01 = 30 calendar dates.
|
*/

export function getDefaultTransactionDateRange() {
  const to =
    new Date();

  const from =
    new Date();

  from.setDate(
    from.getDate() - 29,
  );

  return {
    from:
      toTransactionDateInputValue(
        from,
      ),

    to:
      toTransactionDateInputValue(
        to,
      ),
  };
}