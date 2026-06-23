'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarContent } from './sidebar-content';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-80 p-0 bg-[#07150d]"
      >
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>
              Main navigation menu for the dashboard.
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>

        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}