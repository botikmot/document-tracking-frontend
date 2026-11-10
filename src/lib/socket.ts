import { io } from 'socket.io-client';

export const socket = io(
  'https://controls-oecd-maximize-tba.trycloudflare.com/', // http://localhost:4000', //
  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);
