const socket = io();

socket.on('connect', () => {
    console.log('Connected to localhost:3000', socket.id);
}); 

export { socket };