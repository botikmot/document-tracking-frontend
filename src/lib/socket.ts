import { io } from 'socket.io-client';

export const socket = io(
  'https://manufacturer-ecological-dat-tone.trycloudflare.com/', // 'http://localhost:4000', //
  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);
