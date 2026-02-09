import { Board } from '@shared/board/board.js';
import { RemoteCursorMap } from '../shared/remote-cursor/remote-cursor-map.js';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { RoomRegistry } from './room/room-registry.js';
import { RoomService } from './room/room.service.js';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const client = new PrismaClient({ adapter });

export class AppContext {
	public db: PrismaClient;
	public roomRegistry: RoomRegistry;

	constructor() {
		this.roomRegistry = new RoomRegistry();
		this.db = client;
	}
}
