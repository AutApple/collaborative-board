import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);
});

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..',  'public', 'index.html'));
});

httpServer.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});