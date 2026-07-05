'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export function MessageActions({
  onEdit,
  onDelete,
}: Props) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <button
          className="
            cursor-pointer
            rounded-lg
            p-1
            text-slate-500
            transition
            hover:bg-slate-200
            hover:text-slate-700
            dark:hover:bg-[#163122]
            dark:hover:text-white
          "
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem
          onClick={onEdit}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}