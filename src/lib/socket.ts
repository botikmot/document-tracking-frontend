import { io } from 'socket.io-client';

export const socket = io(
  'http://localhost:4000', //'https://deliver-means-editorial-gadgets.trycloudflare.com', 

  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);