import express from 'express';

import { createServer } from 'node:http';
import path from 'path';
import { __rootdir } from './utils/path.utils.js';
import { BoardServer } from './board-app/app.js';
import { createAndMapApiModules } from './api/index.js';
import { initPageRoutes } from './pages.js';

import { env } from '@shared/config/env.config.js';

const app = express();
const httpServer = createServer(app);

const boardApp = new BoardServer(httpServer);
boardApp.run();

app.use(express.json());
app.use(express.static(path.join(__rootdir, 'public-dist')));

createAndMapApiModules(app);
initPageRoutes(app);

httpServer.listen(env.APP_PORT || 3000, () => {
	console.log(`Server running on port ${env.APP_PORT || 3000}`);
});
