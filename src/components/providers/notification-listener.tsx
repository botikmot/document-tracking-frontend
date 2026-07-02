'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { socket } from '@/lib/socket';
import { useNotificationStore, type Notification as AppNotification } from '@/store/notification.store';
import { useSettingsStore } from '@/store/settings.store';

export function NotificationListener() {
  const { addNotification } =
    useNotificationStore();

  const { settings } =
    useSettingsStore();

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    /*
    |----------------------------------------------------
    | INITIALIZE AUDIO
    |----------------------------------------------------
    */
    audioRef.current = new Audio(
      '/sounds/notification.mp3',
    );

    /*
    |----------------------------------------------------
    | UNLOCK AUDIO AFTER FIRST USER INTERACTION
    |----------------------------------------------------
    */
    const unlockAudio = async () => {
      if (!audioRef.current) return;

      try {
        audioRef.current.muted = true;

        await audioRef.current.play();

        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
      } catch (error) {
        console.error(
          'Failed to unlock audio',
          error,
        );
      }

      window.removeEventListener(
        'pointerdown',
        unlockAudio,
      );
    };

    window.addEventListener(
      'pointerdown',
      unlockAudio,
    );

    /*
    |----------------------------------------------------
    | SOCKET LISTENER
    |----------------------------------------------------
    */
    const handleNotification = async (
      data: AppNotification,
    ) => {
      if (
        settings.notificationSounds &&
        audioRef.current
      ) {
        try {
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
        } catch (error) {
          console.error(
            'Failed to play notification sound',
            error,
          );
        }
      }

      toast.success(data.title, {
        description: data.message,
      });

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

      window.removeEventListener(
        'pointerdown',
        unlockAudio,
      );
    };
  }, [
    addNotification,
    settings.notificationSounds,
  ]);

  return null;
}