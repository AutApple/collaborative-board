import express from 'express';

import { createServer } from 'node:http';
import path from 'path';
import { __rootdir } from './utils/path.utils.js';
import { BoardServer } from './board-app/app.js';
import { createAndMapApiModules } from './api/index.js';
import { initPageRoutes } from './pages.js';

import { env } from '@shared/config/env.config.js';
import cookieParser from 'cookie-parser';
import { CommandBus } from './command-bus/command-bus.js';

const app = express();
const httpServer = createServer(app);

const commandBus = new CommandBus();

const boardApp = new BoardServer(httpServer, commandBus);
boardApp.run();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__rootdir, 'public-dist')));

createAndMapApiModules(app, commandBus);
initPageRoutes(app);

httpServer.listen(env.APP_PORT || 3000, () => {
	console.log(`Server running on port ${env.APP_PORT || 3000}`);
});
