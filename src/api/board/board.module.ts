import { Router } from 'express';
import { APIBoardController } from './board.controller.js';
import { APIBoardService } from './board.service.js';
import { APIBaseRouter } from '../common/base.router.js';
import { APIBoardRepository } from './board.repo.js';
import dbClient from '../../db.js';
import { APIBoardRouter } from './board.router.js';

export default function createBoardApiModule(): Router {
    const repository = new APIBoardRepository(dbClient);
    const service = new APIBoardService(repository);
    const controller  = new APIBoardController(service);
    const router = new APIBoardRouter(controller);

    return router.getRouter();
}