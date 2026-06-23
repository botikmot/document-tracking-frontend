'use client';

import { SidebarContent } from "./sidebar-content";

export function Sidebar() { 

  return (
    <aside className="sticky top-0 hidden h-screen w-80 flex-col border-r border-white/10 bg-[#07150d] lg:flex">
        <SidebarContent />
    </aside>
  );
}