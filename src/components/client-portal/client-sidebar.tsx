'use client';

import Link from 'next/link';

import {
  usePathname,
  useRouter,
} from 'next/navigation';

import {
  FilePlus2,
  FileText,
  LayoutDashboard,
  LogOut,
  UserRound,
  X,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import { useClientAuthStore } from '@/store/client-auth-store';

import {
  cn,
} from '@/lib/utils';

interface ClientSidebarProps {
  mobileOpen?: boolean;

  onMobileClose?: () => void;
}

const navigation = [
  {
    label: 'Dashboard',
    href: '/client/dashboard',
    icon: LayoutDashboard,
  },

  {
    label: 'My Applications',
    href: '/client/applications',
    icon: FileText,
  },

  {
    label: 'New Application',
    href: '/client/applications/new',
    icon: FilePlus2,
  },

  {
    label: 'Profile',
    href: '/client/profile',
    icon: UserRound,
  },
];

export function ClientSidebar({
  mobileOpen = false,
  onMobileClose,
}: ClientSidebarProps) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    client,
    logout,
  } = useClientAuthStore();

  const fullName = [
    client?.firstName,
    client?.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  function handleLogout() {
    logout();

    onMobileClose?.();

    router.replace(
      '/client/login',
    );
  }

  function isActive(
    href: string,
  ) {
    if (
      href === '/client/dashboard'
    ) {
      return (
        pathname ===
        '/client/dashboard'
      );
    }

    if (
      href ===
      '/client/applications'
    ) {
      return (
        pathname ===
        '/client/applications'
      );
    }

    return pathname.startsWith(
      href,
    );
  }

  const content = (
    <div className="flex h-full flex-col">
      {/* BRAND */}
      <div className="flex h-16 items-center justify-between border-b px-5">
        <Link
          href="/client/dashboard"
          onClick={
            onMobileClose
          }
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            e
          </div>

          <div className="leading-tight">
            <p className="font-semibold">
              eDATS+
            </p>

            <p className="text-xs text-muted-foreground">
              Client Portal
            </p>
          </div>
        </Link>

        {onMobileClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={
              onMobileClose
            }
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              isActive(
                item.href,
              );

            return (
              <Link
                key={item.href}
                href={
                  item.href
                }
                onClick={
                  onMobileClose
                }
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',

                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />

                {item.label}
              </Link>
            );
          },
        )}
      </nav>

      {/* CLIENT */}
      <div className="border-t p-4">
        <div className="mb-3 px-2">
          <p className="truncate text-sm font-medium">
            {fullName ||
              'Client'}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {client?.email}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={
            handleLogout
          }
        >
          <LogOut className="mr-2 h-4 w-4" />

          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background md:block">
        {content}
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/50"
            onClick={
              onMobileClose
            }
          />

          <aside className="relative h-full w-72 bg-background shadow-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}