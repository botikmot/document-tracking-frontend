import { io } from 'socket.io-client';

export const socket = io(
  'http://localhost:4000', //'https://expiration-interview-duke-liquid.trycloudflare.com',

  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);