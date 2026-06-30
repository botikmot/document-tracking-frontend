import { io } from 'socket.io-client';

export const socket = io(
  'https://deliver-means-editorial-gadgets.trycloudflare.com', //'http://localhost:4000',

  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);