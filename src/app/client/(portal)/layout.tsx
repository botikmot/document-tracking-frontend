import type {
  ReactNode,
} from 'react';

import {
  ClientPortalShell,
} from '@/components/client-portal/client-portal-shell';

interface ClientPortalLayoutProps {
  children: ReactNode;
}

export default function ClientPortalLayout({
  children,
}: ClientPortalLayoutProps) {
  return (
    <ClientPortalShell>
      {children}
    </ClientPortalShell>
  );
}