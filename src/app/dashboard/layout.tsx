'use client'

import {
  ProtectedLayout,
} from '@/components/layout/protected-layout';
import { useNotificationStore } from '@/store/notification.store';
import { useCommunityStore } from '@/store/community.store';
import { useEffect } from 'react';
import { api } from '@/lib/axios';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );

  async function fetchNotifications() {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      }
    }

  const fetchCommunities =
      useCommunityStore(
          (state) => state.fetchCommunities,
      );

  const fetchChatUsers =
      useCommunityStore(
          (state) => state.fetchChatUsers,
      );

  useEffect(() => {
    async function initialize() {
      try {
        await Promise.all([
          fetchNotifications(),
          fetchCommunities(),
          fetchChatUsers(),
        ]);
      } catch (error) {
        console.error(error);
      }
    }

    initialize();
  }, []);
 
  return (
    <ProtectedLayout>
      {children}
    </ProtectedLayout>
  );
}