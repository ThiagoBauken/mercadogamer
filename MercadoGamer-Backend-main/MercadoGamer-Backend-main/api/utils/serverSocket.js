const io = require('socket.io-client');
// https://mercadogamer.com
// http://localhost:10111
var socket = io('https://mercadogamer.com', {
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
