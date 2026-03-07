import express from 'express';

import { createServer } from 'node:http';
import path from 'path';
import { __rootdir } from './utils/path.utils.js';
import { BoardServer } from './board-app/app.js';
import { createAndMapApiModules } from './api/index.js';
import { initPageRoutes } from './pages.js';

import { env } from 'src/config/env.config.js';
import cookieParser from 'cookie-parser';
import { CommandBus } from './command-bus/command-bus.js';

const publicApp = express();

const httpServer = createServer(publicApp);

const commandBus = new CommandBus();

const boardApp = new BoardServer(httpServer, commandBus);

publicApp.use(express.json());
publicApp.use(cookieParser());
createAndMapApiModules(publicApp, commandBus);


boardApp.run();
publicApp.use(express.static(path.join(__rootdir, 'public-dist')));
initPageRoutes(publicApp);

httpServer.listen(env.APP_PORT || 3000, () => {
	console.log(`Server running on port ${env.APP_PORT || 3000}`);
});
