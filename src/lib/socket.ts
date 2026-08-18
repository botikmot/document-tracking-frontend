import { io } from 'socket.io-client';

export const socket = io(
  'https://charles-packs-plaintiff-streams.trycloudflare.com/', // 'http://localhost:4000', // 
  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);
