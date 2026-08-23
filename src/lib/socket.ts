import { io } from 'socket.io-client';

export const socket = io(
  'https://concentration-kitchen-reading-reproductive.trycloudflare.com/', // http://localhost:4000', //
  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);
