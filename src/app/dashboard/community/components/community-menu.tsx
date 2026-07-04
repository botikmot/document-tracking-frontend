'use client';

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

type Props = {
  isGeneral: boolean;
  onEdit: () => void;
  onMembers: () => void;
  onDelete: () => void;
};

export function CommunityMenu({
  isGeneral,
  onEdit,
  onMembers,
  onDelete,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="
            cursor-pointer
            h-10
            w-10
            rounded-xl
            hover:bg-green-100
            dark:hover:bg-[#163122]
          "
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          w-60
          rounded-2xl
          border
          bg-white
          p-2
          shadow-xl
          dark:border-[#21442f]
          dark:bg-[#102418]
        "
      >
        <DropdownMenuItem
          onClick={onEdit}
          disabled={isGeneral}
          className="cursor-pointer rounded-xl"
        >
          <Pencil className="mr-3 h-4 w-4 text-green-600" />

          Edit Channel
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onMembers}
          className="cursor-pointer rounded-xl"
        >
          <Users className="mr-3 h-4 w-4 text-green-600" />

          Manage Members
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isGeneral}
          onClick={onDelete}
          className="
            cursor-pointer
            rounded-xl
            text-red-600
            focus:bg-red-50
            focus:text-red-600
            dark:focus:bg-red-900/20
          "
        >
          <Trash2 className="mr-3 h-4 w-4" />

          Delete Channel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}