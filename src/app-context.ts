import { Board } from '@shared/board/board.js';
import { RemoteCursorMap } from '../shared/remote-cursor/remote-cursor-map.js';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { RoomMap } from './room-map.js';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const client = new PrismaClient({ adapter });

export class AppContext {
	public roomRegistry: RoomMap;
	public db: PrismaClient;

	constructor() {
		this.roomRegistry = new RoomMap();
		this.db = client;
	}
}
