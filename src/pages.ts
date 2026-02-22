import type { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import { __rootdir } from './utils/path.utils.js';

export function initPageRoutes(app: Application) {
	app.get('/', (_, res) => {
		res.sendFile(path.join(__rootdir, 'public-dist', 'index.html'));
	});
	app.get('/create-board', (_, res) => {
		res.sendFile(path.join(__rootdir, 'public-dist', 'create-board.html'));
	});
	app.get('/board', (_, res) => {
		res.sendFile(path.join(__rootdir, 'public-dist', 'app.html'));
	});

	app.use((_: Request, res: Response, next: NextFunction) => {
		res.status(404).sendFile(path.join(__rootdir, 'public-dist', '404.html'));
	});
}
