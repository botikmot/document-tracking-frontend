type FormatDurationOptions = {
  showSeconds?: boolean;
};

export function formatDuration(
  milliseconds?: number | null,
  options: FormatDurationOptions = {},
) {
  if (
    milliseconds === null ||
    milliseconds === undefined
  ) {
    return '-';
  }

  const safeMilliseconds = Math.max(milliseconds, 0);

  const totalSeconds = Math.floor(
    safeMilliseconds / 1000,
  );

  const days = Math.floor(
    totalSeconds / 86400,
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds =
    totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (options.showSeconds) {
    parts.push(`${seconds}s`);
  }

  if (parts.length === 0) {
    return options.showSeconds
      ? '0s'
      : '0m';
  }

  return parts.join(' ');
}