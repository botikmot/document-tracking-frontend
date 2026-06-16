'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { socket } from '@/lib/socket';

export function NotificationListener() {
  useEffect(() => {
    socket.on(
      'notification',
      (data) => {
        /*
        |--------------------------------------------------------------------------
        | SOUND
        |--------------------------------------------------------------------------
        */

        const audio = new Audio(
          '/sounds/notification.mp3',
        );

        void audio.play();

        /*
        |--------------------------------------------------------------------------
        | TOAST
        |--------------------------------------------------------------------------
        */

        toast.success(data.title, {
          description:
            data.message,
        });
      },
    );

    return () => {
      socket.off(
        'notification',
      );
    };
  }, []);

  return null;
}