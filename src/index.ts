import express from 'express';
import { type Request, type Response } from 'express';

import { createServer } from 'node:http';
import path from 'path';
import { __rootdir } from './utils/path.utils.js';
import dotenv from 'dotenv';
import { BoardServer } from './board-app/app.js';
import { createAndMapApiModules } from './api/index.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const boardApp = new BoardServer(httpServer);
boardApp.run();

app.use(express.json());
app.use(express.static(path.join(__rootdir, 'public-dist')));

createAndMapApiModules(app);

// TODO: put page serving into separate file
app.get('/board', (_, res) => {
	res.sendFile(path.join(__rootdir, 'public-dist', 'index.html'));
});

httpServer.listen(process.env.APP_PORT || 3000, () => {
	console.log(`Server running on port ${process.env.APP_PORT || 3000}`);
});
