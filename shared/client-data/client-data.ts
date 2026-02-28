import type { Cursor } from '../cursor/cursor.js';

export class ClientData {
	constructor(
		public readonly clientId: string,
		public readonly isLocal: boolean,
		public readonly cursor: Cursor,
	) {}
}
