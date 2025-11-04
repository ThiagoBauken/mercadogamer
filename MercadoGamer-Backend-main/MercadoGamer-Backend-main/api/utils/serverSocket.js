const io = require('socket.io-client');

// Usar variável de ambiente ou fallback para localhost
const SOCKET_URL = process.env.SOCKET_SERVER_URL || 'http://localhost:3000';

var socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 2000,
});

const connect = () => {
  socket.connect();
  socket.on('connect', () => {
    console.log('server socket created', socket.id); // x8WIv7-mJelg7on_ALbx
  });
};

module.exports = {
  socket,
  connect,
};
