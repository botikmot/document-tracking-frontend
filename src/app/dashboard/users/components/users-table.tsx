'use client';

import {
  Building2,
  Mail,
  MoreHorizontal,
  Search,
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

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

import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/axios';
import { UserDialog } from './user-dialog';

type Props = {
  onSuccess: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users?: any;
  loading?: boolean;
};

export function UsersTable({
  users,
  onSuccess
}: Props) {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const handleRemove = async (userId: string) => {
    try {
      const res = await api.delete(`/api/users/${userId}`);

      console.log('delete user:', res)
      
    } catch (err) {
      console.error(err);
    }

  }
  return (
    <Card className="rounded-3xl border-0 bg-white shadow-sm">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="text-2xl font-black">
          System Users
        </CardTitle>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Search users..."
            className="h-11 rounded-2xl pl-11"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {users.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (user: any) => (
              <div
                key={user.id}
                className="group flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg lg:flex-row lg:items-center lg:justify-between"
              >
                {/* LEFT */}
                <div className="flex items-center gap-5">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-blue-100 text-lg font-bold text-blue-700">
                      {
                        `${user.firstName[0]}${user.lastName[0]}`
                      }
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">
                        {
                          `${user.firstName} ${user.lastName}`
                        }
                      </h3>

                      <Badge className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100">
                        {
                          user.roles?.[0]?.role?.name
                        }
                      </Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />

                        {
                          user.email
                        }
                      </div>

                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />

                        {
                          user.offices?.[0]?.office?.officeName
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  <Badge
                    className={
                      user.status === 'ACTIVE'
                        ? 'rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        : 'rounded-full bg-red-100 text-red-700 hover:bg-red-100'
                    }
                  >
                    {user.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="rounded-2xl">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenEdit(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleRemove(user.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ),
          )}
        </div>
      </CardContent>

     <UserDialog
        mode="update"
        user={selectedUser}
        open={openEdit}
        onOpenChange={setOpenEdit}
        onSuccess={onSuccess}
      />

    </Card>
  );
}