import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';

import path from 'path';
import { __rootdir } from './utils/path.utils.js';
import { ClientBoardEvents, ServerBoardEvents } from '@shared/socket-events/board.socket-events.js';
import dotenv from 'dotenv';
import { rawElementToInstance } from '@shared/board/elements/utils/raw-element-to-instance.js';
import type { RawBoardElement } from '@shared/board/elements/raw/index.js';
import { Board } from '@shared/board/board.js';


dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

const board: Board = new Board();

io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);
    socket.emit(ServerBoardEvents.RefreshBoard, board.getElements().map(element => element.toRaw()));
    socket.on(ClientBoardEvents.AddElement, (rawElement: RawBoardElement) => {
        const element = rawElementToInstance(rawElement);
        board.appendElement(element);

        // console.log('New board element recieved! Sending update to all clients.');
        io.emit(ServerBoardEvents.AddElement, element.toRaw());
    });
    socket.on(ClientBoardEvents.RequestRefresh, () => {
        socket.emit(ServerBoardEvents.RefreshBoard, board.getElements().map(element => element.toRaw()));
    });
});

console.log(path.join(__rootdir, 'public-dist', 'index.html'));
app.use(express.static(path.join(__rootdir, 'public-dist')));
app.get('/', (_, res) => {
    console.log(path.join(__rootdir, 'public-dist', 'index.html'));
    res.sendFile(path.join(__rootdir, 'public-dist', 'index.html'));
});

httpServer.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Server running on port ${process.env.APP_PORT || 3000}`);
});