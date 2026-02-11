import express from 'express';
import { createServer } from 'node:http';
import path from 'path';
import { __rootdir } from './utils/path.utils.js';
import dotenv from 'dotenv';
import { BoardServer } from './board-app/app.js';
import createBoardApiModule from './api/board/board.module.js';


dotenv.config();

const app = express();
const httpServer = createServer(app);

const boardApp = new BoardServer(httpServer);
boardApp.run();

app.use(express.json());
app.use(express.static(path.join(__rootdir, 'public-dist')));


const apiBoardModule = createBoardApiModule(); // TODO: put api init in sep file

app.use('/api/boards', apiBoardModule);
app.get('/:id', (_, res) => { // TODO: put client serving into separate file 
	res.sendFile(path.join(__rootdir, 'public-dist', 'index.html'));
});




httpServer.listen(process.env.APP_PORT || 3000, () => {
	console.log(`Server running on port ${process.env.APP_PORT || 3000}`);
});
