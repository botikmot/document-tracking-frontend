'use client';

import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useCommunityStore } from '@/store/community.store';

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
      addMessage,
    );

    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off(
        'new-message',
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