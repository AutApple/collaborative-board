import type { XY } from '../utils/vec2.utils.js';
import type { Cursor } from './types/cursor.js';

export class RemoteCursorMap {
	private map: Map<string, Cursor> = new Map();

	constructor(...remoteCursors: Cursor[]) {
		for (const cursor of remoteCursors) this.map.set(cursor.clientId, cursor);
	}

	public addLocal(): void {
		this.map.set('0', { clientId: '0', local: true, worldCoords: { x: 0, y: 0 } });
	}

	public getLocal(): Cursor | undefined {
		return this.map.get('0');
	}

	public setPosition(clientId: string, position: XY) {
		const cursor = this.map.get(clientId);
		if (!cursor) return;
		cursor.worldCoords = { ...position };
	}

	public getPosition(clientId: string): XY | undefined {
		const cursor = this.map.get(clientId);
		return cursor?.worldCoords;
	}

	public addCursor(cursor: Cursor) {
		this.map.set(cursor.clientId, cursor);
	}
	public removeCursor(clientId: string) {
		this.map.delete(clientId);
	}

	public foreignToList(): Cursor[] {
		const list: Cursor[] = [];
		for (const clientId of this.map.keys()) {
			const cursor = this.map.get(clientId)!;
			if (!cursor.local) list.push(cursor);
		}
		return list;
	}
}
