'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  Inbox,
  Send,
  Clock3,
  Archive,
  Settings,
  Users,
  Building2,
  LogOut,
  FileText,
  ChartColumn,
  MessageSquare,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useNotificationStore } from '@/store/notification.store';
import { useCommunityStore } from '@/store/community.store';


export function SidebarContent() {

  const communities = useCommunityStore(
    (state) => state.communities,
  );

  const chatUsers = useCommunityStore(
    (state) => state.chatUsers,
  );

  const pathname =
    usePathname();

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
      href:
        '/dashboard/documents',
      icon: FileText,
    },
    {
      label: 'Incoming',
      href:
        '/dashboard/incoming',
      icon: Inbox,
    },
    {
      label: 'Outgoing',
      href:
        '/dashboard/outgoing',
      icon: Send,
    },
    {
      label: 'Pending',
      href:
        '/dashboard/pending',
      icon: Clock3,
    },
    {
      label: 'Community',
      href: '/dashboard/community',
      icon: MessageSquare,
    },
    {
      label: 'Archived',
      href:
        '/dashboard/archived',
      icon: Archive,
    },
    {
      label: 'Reports',
      href:
        '/dashboard/reports',
      icon: ChartColumn,
    },
    {
      label: 'Settings',
      href:
        '/dashboard/settings',
      icon: Settings,
    },
  ];

  const unreadCounts =
    useNotificationStore(
      (state) =>
        state.unreadCounts,
    );

  const totalCommunityUnread = communities.reduce(
    (sum, community) => sum + (community.unreadCount ?? 0),
    0,
  );

  const totalDirectUnread = chatUsers.reduce(
    (sum, user) => sum + (user.unreadCount ?? 0),
    0,
  );

  const totalChatUnread =
    totalCommunityUnread + totalDirectUnread;

  console.log('unread:', unreadCounts)

   return (
    <>
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white p-1">
            <Image
              src="/images/logo_denr.png"
              alt="DENR"
              width={54}
              height={54}
            />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-wide text-white">
              eDATS+
            </h1>

            <p className="text-xs text-green-100/70">
              Document Action Tracking System
            </p>
          </div>
        </div>
      </div>

      {/* ====================================== */}
      {/* USER INFO */}
      {/* ====================================== */}
      <div className="border-b border-white/10 p-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
              {/* <ShieldCheck className="h-7 w-7 text-green-300" /> */}
              <Avatar className="h-12 w-12 ">
                <AvatarImage
                  src={
                    user?.profileImageUrl
                  }
                />

                <AvatarFallback className="bg-green-600 text-3xl text-white">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-widest text-green-100/50">
                Logged in as
              </p>

              <h2 className="truncate text-lg font-bold text-white capitalize">
                {user?.firstName ??
                  'Employee'}
              </h2>

              <p className="mt-1 truncate text-xs text-green-100/60">
                {roles.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================== */}
      {/* NAVIGATION */}
      {/* ====================================== */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2">
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
                  'group flex items-center justify-between gap-4 rounded-2xl px-5 py-2 text-sm font-semibold transition-all duration-300',
                  active
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl'
                    : 'text-green-50/70 hover:bg-white/5 hover:text-white',
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-2xl transition-all',
                      active
                        ? 'bg-white/10'
                        : 'bg-white/5 group-hover:bg-white/10',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span>
                    {menu.label}
                  </span>
                </div>

                {menu.href ===
                  '/dashboard/pending' &&
                  unreadCounts.DEADLINE >
                    0 && (
                    <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                      {unreadCounts.DEADLINE > 9
                          ? '9+'
                          : unreadCounts.DEADLINE}
                    </span>
                )}

                {menu.href ===
                  '/dashboard/incoming' &&
                  unreadCounts.ROUTED >
                    0 && (
                    <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                      {unreadCounts.ROUTED > 9
                        ? '9+'
                        : unreadCounts.ROUTED}
                    </span>
                )}

                {menu.href === '/dashboard/community' &&
                  totalChatUnread > 0 && (
                    <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                      {totalChatUnread > 99
                        ? '99+'
                        : totalChatUnread}
                    </span>
                )}

              </Link>
            );
          })}
        </div>

        {/* ====================================== */}
        {/* ADMIN */}
        {/* ====================================== */}
        {isSuperAdmin && (
          <div className="mt-8">
            <div className="mb-4 px-3">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-100/40">
                Administration
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/users"
                className={cn(
                  'group flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300',
                  pathname ===
                    '/dashboard/users'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl'
                    : 'text-green-50/70 hover:bg-white/5 hover:text-white',
                )}
              >
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-2xl transition-all',
                    pathname ===
                      '/dashboard/users'
                      ? 'bg-white/10'
                      : 'bg-white/5 group-hover:bg-white/10',
                  )}
                >
                  <Users className="h-5 w-5" />
                </div>

                Users
              </Link>

              <Link
                href="/dashboard/offices"
                className={cn(
                  'group flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300',
                  pathname ===
                    '/dashboard/offices'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl'
                    : 'text-green-50/70 hover:bg-white/5 hover:text-white',
                )}
              >
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-2xl transition-all',
                    pathname ===
                      '/dashboard/offices'
                      ? 'bg-white/10'
                      : 'bg-white/5 group-hover:bg-white/10',
                  )}
                >
                  <Building2 className="h-5 w-5" />
                </div>

                Offices
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ====================================== */}
      {/* FOOTER */}
      {/* ====================================== */}
      <div className="border-t border-white/10 p-5">
        <Button
          variant="outline"
          onClick={() => {
            logout();

            window.location.href =
              '/login';
          }}
          className="h-14 w-full justify-start rounded-2xl border-white/10 bg-white/5 text-green-100 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />

          Logout
        </Button>
      </div>
    </>
   )
}