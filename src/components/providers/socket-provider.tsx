'use client';

import { useEffect } from 'react';
import { socket } from '@/lib/socket';

export function SocketProvider({
  userId,
}: {
  userId: string;
}) {
  useEffect(() => {
    if (!userId) {
      return;
    }
    socket.connect();
    socket.emit('join', userId);
    console.log('SOCKET CONNECTED');
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return null;
}