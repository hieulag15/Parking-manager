import io from 'socket.io-client';

const socket = io("http://localhost:5000", {   //   import.meta.env.VITE_DOMAIN_WS
  path: '/socket',
  transports: ['websocket'], // use only WebSocket transport (optional)
  withCredentials: true, // include credentials when making cross-origin requests
});

export default socket;
