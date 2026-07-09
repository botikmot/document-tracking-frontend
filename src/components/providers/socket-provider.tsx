'use client';

import { useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { useCommunityStore } from '@/store/community.store';
import communityService from '@/services/community.service';
import { useSettingsStore } from '@/store/settings.store';

export function SocketProvider({
  userId,
}: {
  userId: string;
}) {

  const notificationAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    notificationAudio.current = new Audio('/sounds/message_notification.wav');

    notificationAudio.current.volume = 0.5;
  }, []);


  const playNotificationIfNeeded = () => {
    const enabled =
      useSettingsStore.getState().settings.notificationSounds;

    if (!enabled) return;

    if (!notificationAudio.current) return;

    notificationAudio.current.pause();
    notificationAudio.current.currentTime = 0;

    notificationAudio.current
      .play()
      .catch(console.error);
  };

 
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

  
  const setUnread =
    useCommunityStore(
      (state) => state.setUnread,
    );

  
  const updateMessage =
    useCommunityStore(
      (state) =>
        state.updateMessage,
    );

  const deleteMessage =
    useCommunityStore(
      (state) =>
        state.deleteMessage,
    );

  const addTypingUser =
    useCommunityStore(
      (state) => state.addTypingUser,
    );

  const removeTypingUser =
    useCommunityStore(
      (state) => state.removeTypingUser,
    );

  const clearTypingUsers =
    useCommunityStore(
      (state) => state.clearTypingUsers,
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

        const isViewingConversation = current?.id === message.communityId;

        if (isViewingConversation) {
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

        console.log(
          'community-unread received',
          communityId,
          unreadCount,
        );

        setUnread(
          communityId,
          unreadCount,
        );
        playNotificationIfNeeded();
      },
    );

    socket.on(
      'message-updated',
      updateMessage,
    );

    socket.on(
      'message-deleted',
      deleteMessage,
    );

    socket.on(
      'reaction-updated',
      (message) => {
        useCommunityStore
          .getState()
          .updateMessage(message);
      },
    );

    socket.on(
      'user-typing',
      (user) => {

        // Don't show yourself typing
        if (user.userId === userId) {
          return;
        }

        const current =
          useCommunityStore.getState()
            .selectedCommunity;

        // Ignore if not viewing this community
        if (
          current?.id !== user.communityId
        ) {
          return;
        }

        addTypingUser(user);

      },
    );

    socket.on(
      'user-stop-typing',
      ({ userId: typingUserId }) => {

        removeTypingUser(
          typingUserId,
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

      socket.off(
        'message-updated',
      );

      socket.off(
        'message-deleted',
      );

      socket.off('reaction-updated');

      socket.off(
        'user-typing',
      );

      socket.off(
        'user-stop-typing',
      );

      socket.disconnect();
    };
  }, [addMessage, deleteMessage, setOnlineUsers, setUnread, updateMessage, userId]);

   // ---------------------------------------
  // Join Community
  // ---------------------------------------

  useEffect(() => {
    console.log('Selected Community:', selectedCommunity);

    clearTypingUsers();

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
  }, [selectedCommunity, clearTypingUsers]);

  return null;
}