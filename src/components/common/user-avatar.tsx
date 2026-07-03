'use client';

import { cn } from '@/lib/utils';

type Props = {
  firstName: string;
  lastName: string;
  profileImageUrl?: string | null;
  className?: string;
};

export function UserAvatar({
  firstName,
  lastName,
  profileImageUrl,
  className,
}: Props) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  if (profileImageUrl) {
    return (
      <img
        src={profileImageUrl}
        alt={`${firstName} ${lastName}`}
        className={cn(
          'h-11 w-11 rounded-full object-cover',
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-600 font-bold text-white',
        className,
      )}
    >
      {initials}
    </div>
  );
}