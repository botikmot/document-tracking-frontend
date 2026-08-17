import { io } from 'socket.io-client';

export const socket = io(
  'http://localhost:4000', // 'https://charles-packs-plaintiff-streams.trycloudflare.com/', //
  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);
