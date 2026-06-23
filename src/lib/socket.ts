import { io } from 'socket.io-client';

export const socket = io(
  'https://expiration-interview-duke-liquid.trycloudflare.com', //'http://localhost:4000',

  {
    autoConnect: false,

    transports: [
      'websocket',
      'polling',
    ],
  },
);