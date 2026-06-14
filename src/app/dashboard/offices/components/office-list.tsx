'use client';

import {
  Building2,
  MoreHorizontal,
  Search,
  Pencil,
  Trash2,
} from 'lucide-react';

import type {
  Office,
} from '@/types/office';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Input,
} from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OfficeDialog from './office-dialog';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export function OfficeList({
  offices,
  loading,
  onRefresh,
}: {
  offices: Office[];
  loading: boolean;
  onRefresh: () => void;
}) {

  const handleDelete =
    async (
      officeId: string,
    ) => {
      const confirmed =
        window.confirm(
          'Are you sure you want to delete this office?',
        );

      if (!confirmed)
        return;

      try {
        await api.delete(
          `/offices/${officeId}`,
        );
        toast.success('Office deleted successfully');
        onRefresh();
        //window.location.reload();
      } catch (error) {
        toast.error('Failed to delete office');
        console.error(error);
      }
    };



  return (
    <Card className="rounded-3xl border-0 bg-white shadow-sm">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="text-2xl font-black">
          Offices Directory
        </CardTitle>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Search office..."
            className="h-11 rounded-2xl pl-11"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {offices.map(
            (office) => (
              <div
                key={
                  office.id
                }
                className="group flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 transition group-hover:bg-blue-100">
                    <Building2 className="h-8 w-8 text-slate-700 group-hover:text-blue-700" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        {
                          office.officeName
                        }
                      </h3>

                      <Badge className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100">
                        {
                          office.officeCode
                        }
                      </Badge>
                    </div>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      {
                        office.description ||
                        'No description available.'
                      }
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-2xl"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <OfficeDialog
                      office={office}
                      onSuccess={onRefresh}
                    />

                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() =>
                        handleDelete(
                          office.id,
                        )
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Office
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  );
}