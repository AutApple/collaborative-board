import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';

import path from 'path';
import { __rootdir } from './utils/path.utils.js';
import type { Point } from './types/point.js';
import { Stroke } from './types/stroke.js';

import dotenv from 'dotenv';
dotenv.config();



const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

const boardData: Stroke[] = [];


io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);
    socket.emit('refreshBoard', boardData);
    socket.on('stroke', (points: Point[]) => {
        const stroke = new Stroke(points);
        boardData.push(stroke);
        // console.log('New stroke recieved! Sending update to all clients.');
        socket.broadcast.emit('addStroke', stroke);
    });
    socket.on('requestRefresh', () => {
        socket.emit('refreshBoard', boardData);
    })
});

app.use(express.static(path.join(__rootdir, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__rootdir, 'public', 'index.html'));
});

httpServer.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Server running on port ${process.env.APP_PORT || 3000}`);
});