import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';

import path from 'path';
import { __rootdir } from './utils/path.utils.js';
import { StrokeBoardElement } from '@shared/board-elements/stroke.board-element.js';
import { ClientBoardEvents, ServerBoardEvents } from '@shared/socket-events/board.socket-events.js';
import dotenv from 'dotenv';
dotenv.config();



const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

const boardData: StrokeBoardElement[] = [];


io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);
    socket.emit(ServerBoardEvents.RefreshBoard, boardData);
    socket.on(ClientBoardEvents.Stroke, (stroke: StrokeBoardElement) => {
        boardData.push(stroke);
        // console.log('New stroke recieved! Sending update to all clients.');
        socket.broadcast.emit(ServerBoardEvents.AddStroke, stroke);
    });
    socket.on(ClientBoardEvents.RequestRefresh, () => {
        socket.emit(ServerBoardEvents.RefreshBoard, boardData);
    })
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