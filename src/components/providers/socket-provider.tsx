'use client';

import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useCommunityStore } from '@/store/community.store';
import communityService from '@/services/community.service';

export function SocketProvider({
  userId,
}: {
  userId: string;
}) {

  const selectedCommunity =
    useCommunityStore(
      (state) => state.selectedCommunity,
    );

  const addMessage =
    useCommunityStore(
      (state) => state.addMessage,
    );

  const setOnlineUsers =
    useCommunityStore(
      (state) => state.setOnlineUsers,
    );

  /* const updateUnread =
    useCommunityStore(
        (s) => s.updateUnread,
    ); */

  const incrementUnread =
    useCommunityStore(
      (state) => state.incrementUnread,
    );

  const setUnread =
    useCommunityStore(
      (state) => state.setUnread,
    );

  const clearUnread =
    useCommunityStore(
      (state) => state.clearUnread,
    );

  useEffect(() => {
    if (!userId) {
      return;
    }
    socket.connect();
    socket.emit('join', userId);
    socket.emit('register', userId);
    console.log('SOCKET CONNECTED');

    // ======================================
    // Community
    // ======================================

    socket.off('new-message');
    socket.on(
      'new-message',
      async (message) => {

        addMessage(message);

        const current =
          useCommunityStore.getState()
            .selectedCommunity;

        if (
          current?.id === message.communityId
        ) {
          await communityService.markAsRead(
            message.communityId,
          );

          useCommunityStore
            .getState()
            .clearUnread(
              message.communityId,
            );
        }
      },
    );

    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    socket.on(
      'community-unread',
      ({ communityId, unreadCount }) => {
        const current =
          useCommunityStore.getState()
            .selectedCommunity;

        if (current?.id === communityId) {
          return;
        }

        setUnread(
          communityId,
          unreadCount,
        );
      },
    );

    return () => {
      socket.off(
        'new-message',
      );

      socket.off(
          'community-unread',
      );

      socket.off(
        'online-users',
      );
      socket.disconnect();
    };
  }, [userId]);

   // ---------------------------------------
  // Join Community
  // ---------------------------------------

  useEffect(() => {
    console.log('Selected Community:', selectedCommunity);

    if (!selectedCommunity) return;
    console.log('Connected:', socket.connected);
    socket.emit(
      'join-community',
      selectedCommunity.id,
    );

    console.log('Joining:', selectedCommunity.name);

    return () => {
      socket.emit(
        'leave-community',
        selectedCommunity.id,
      );
    };
  }, [selectedCommunity]);

  return null;
}