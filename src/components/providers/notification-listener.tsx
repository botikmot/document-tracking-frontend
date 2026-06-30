'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { socket } from '@/lib/socket';
import { useNotificationStore, type Notification as AppNotification } from '@/store/notification.store';

export function NotificationListener() {
  const { addNotification } =
    useNotificationStore();

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null,
    );

  useEffect(() => {
    audioRef.current = new Audio(
      '/sounds/notification.mp3',
    );

    const handleNotification = async (
      data: AppNotification,
    ) => {
      /*
       |----------------------------------------------------
       | SOUND
       |----------------------------------------------------
       */

      try {
        audioRef.current!.currentTime = 0;
        await audioRef.current!.play();
      } catch (error) {
        console.error(
          'Failed to play notification sound',
          error,
        );
      }

      /*
       |----------------------------------------------------
       | TOAST
       |----------------------------------------------------
       */

      toast.success(data.title, {
        description: data.message,
      });

      /*
       |----------------------------------------------------
       | UPDATE STORE
       |----------------------------------------------------
       */

      addNotification(data);
    };

    socket.on(
      'notification',
      handleNotification,
    );

    return () => {
      socket.off(
        'notification',
        handleNotification,
      );
    };
  }, [addNotification]);

  return null;
}