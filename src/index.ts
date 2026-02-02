import express from 'express';
import { createServer } from 'node:http';
import path from 'path';
import { __rootdir } from './utils/path.utils.js';
import dotenv from 'dotenv';
import { BoardServer } from './app.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const boardApp = new BoardServer(httpServer);
boardApp.run();

console.log(path.join(__rootdir, 'public-dist', 'index.html'));
app.use(express.static(path.join(__rootdir, 'public-dist')));
app.get('/', (_, res) => {
  console.log(path.join(__rootdir, 'public-dist', 'index.html'));
  res.sendFile(path.join(__rootdir, 'public-dist', 'index.html'));
});

httpServer.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server running on port ${process.env.APP_PORT || 3000}`);
});
