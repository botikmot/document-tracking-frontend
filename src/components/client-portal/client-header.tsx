'use client';

import {
  Menu,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import { useClientAuthStore } from '@/store/client-auth-store';

interface ClientHeaderProps {
  onMenuClick: () => void;
}

export function ClientHeader({
  onMenuClick,
}: ClientHeaderProps) {
  const client =
    useClientAuthStore(
      (state) =>
        state.client,
    );

  const initials = [
    client?.firstName?.[0],
    client?.lastName?.[0],
  ]
    .filter(Boolean)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={
            onMenuClick
          }
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <p className="text-sm font-medium">
            DENR Client Portal
          </p>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Submit and track
            your transactions
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">
            {client?.firstName}{' '}
            {client?.lastName}
          </p>

          <p className="text-xs text-muted-foreground">
            Client
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {initials || 'C'}
        </div>
      </div>
    </header>
  );
}