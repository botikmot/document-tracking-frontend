import { io } from 'socket.io-client';

export const socket = io(
  'https://lane-proposals-lap-peterson.trycloudflare.com/', // http://localhost:4000', //
  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);
