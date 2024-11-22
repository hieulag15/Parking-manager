import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_DOMAIN, {
  path: '/socket',
  transports: ['websocket'],
  withCredentials: true
});

export default socket;