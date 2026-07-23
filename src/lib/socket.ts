import { io } from 'socket.io-client';

export const socket = io(
  'http://localhost:4000', // 'https://manufacturer-ecological-dat-tone.trycloudflare.com/', //
  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);
