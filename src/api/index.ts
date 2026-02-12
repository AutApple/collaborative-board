import { type Express } from 'express';
import createBoardApiModule from './board/board.module.js';

export function createAndMapApiModules(app: Express) {
	const apiBoardModule = createBoardApiModule();
	app.use('/api/boards', apiBoardModule);
}
