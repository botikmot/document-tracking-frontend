'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  Inbox,
  Send,
  Clock3,
  //CheckCircle2,
  Archive,
  Settings,
  Users,
  Building2,
  LogOut,
  FileText,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/store/auth.store';

export function Sidebar() {
  const pathname = usePathname();

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const roles =
    user?.roles ?? [];

  const isSuperAdmin =
    roles.includes(
      'SUPER_ADMIN',
    );

  const logout =
    useAuthStore(
      (state) => state.logout,
    );

  const menus = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Documents',
      href: '/dashboard/documents',
      icon: FileText,
    },
    {
      label: 'Incoming',
      href: '/dashboard/incoming',
      icon: Inbox,
    },
    {
      label: 'Outgoing',
      href: '/dashboard/outgoing',
      icon: Send,
    },
    {
      label: 'Pending',
      href: '/dashboard/pending',
      icon: Clock3,
    },
    /* {
      label: 'Received',
      href: '/dashboard/received',
      icon: CheckCircle2,
    }, */
    {
      label: 'Archived',
      href: '/dashboard/archived',
      icon: Archive,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden w-72 border-r bg-white lg:flex lg:flex-col">
      {/* LOGO */}
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <FileText className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-xl font-black text-slate-900">
              GovTrack
            </h1>

            <p className="text-sm text-slate-500">
              Document Tracking
            </p>
          </div>
        </div>
      </div>

      {/* USER */}
      <div className="border-b p-6">
        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="text-sm text-slate-500">
            Logged in as
          </p>

          <h2 className="mt-1 font-bold text-slate-900">
            {user?.username ??
              'Employee'}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {roles.join(', ')}
          </p>
        </div>
      </div>

      {/* MENU */}
      <div className="flex-1 space-y-2 p-4">
        {menus.map((menu) => {
          const Icon =
            menu.icon;

          const active =
            pathname ===
            menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                active
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Icon className="h-5 w-5" />

              {menu.label}
            </Link>
          );
        })}

        {isSuperAdmin && (
          <>
            <div className="my-4 border-t" />

            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Administration
            </p>

            <Link
              href="/dashboard/users"
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                pathname ===
                  '/dashboard/users'
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Users className="h-5 w-5" />

              Users
            </Link>

            <Link
              href="/dashboard/offices"
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                pathname ===
                  '/dashboard/offices'
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Building2 className="h-5 w-5" />

              Offices
            </Link>
          </>
        )}
      </div>

      {/* LOGOUT */}
      <div className="border-t p-4">
        <Button
          variant="outline"
          onClick={() => {
            logout();

            window.location.href =
              '/login';
          }}
          className="w-full justify-start rounded-2xl"
        >
          <LogOut className="mr-2 h-4 w-4" />

          Logout
        </Button>
      </div>
    </aside>
  );
}