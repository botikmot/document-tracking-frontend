'use client';

import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserDialog } from './user-dialog';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';

type Props = {
  onCreated: () => void;
};

export function UsersHeader({
  onCreated,
}: Props) {
  return (
    <div className="border-b bg-white">
      <div className="flex flex-col gap-5 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex justify-end lg:hidden">
                <MobileSidebar />
          </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100">
            <Users className="h-8 w-8 text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-900">
              User Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage employees,
              administrators,
              and office users.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="rounded-full bg-blue-100 px-4 py-1 text-blue-700">
            System Users
          </Badge>

          <UserDialog
            onSuccess={
              onCreated
            }
            mode="create"
          />
        </div>
      </div>
    </div>
  );
}