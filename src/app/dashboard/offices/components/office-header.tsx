'use client';

import {
  Building2,
} from 'lucide-react';

import {
  Badge,
} from '@/components/ui/badge';

import OfficeDialog from './office-dialog';
import { CreateOrganizationDialog } from './create-organization-dialog';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';

export function OfficeHeader({
  offices,
  organizationUnits,
  onRefresh,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  return (
    <div className="border-b bg-white">
      <div className="flex flex-col gap-5 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}
        <div className="flex justify-end lg:hidden">
                        <MobileSidebar />
                  </div>
        <div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Office Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage offices,
                departments,
                and organizational
                structures.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-blue-100 px-4 py-1 text-blue-700 hover:bg-blue-100">
            {offices.length}{' '}
            Offices
          </Badge>

          <Badge className="rounded-full bg-amber-100 px-4 py-1 text-amber-700 hover:bg-amber-100">
            {
              organizationUnits.length
            }{' '}
            Organizations
          </Badge>

          <CreateOrganizationDialog
            organizationUnits={
              organizationUnits
            }
            onSuccess={
              onRefresh
            }
          />

          <OfficeDialog
            onSuccess={
              onRefresh
            }
          />
        </div>
      </div>
    </div>
  );
}