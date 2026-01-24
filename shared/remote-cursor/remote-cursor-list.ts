import type { XY } from '../types/vec2.type.js';
import type { Cursor } from './types/cursor.js';

export class RemoteCursorMap {
    private map: Map<string, Cursor> = new Map();
    
    constructor (...remoteCursors: Cursor[]) {
        for (const cursor of remoteCursors) 
            this.map.set(cursor.clientId, cursor);   
    }

    public setPosition (clientId: string, position: XY) {
        const cursor = this.map.get(clientId);
        if (!cursor) return;
        cursor.position = {... position}; 
    }
    
    public getPosition (clientId: string): XY | undefined { 
        const cursor = this.map.get(clientId);
        return cursor?.position;
    }

    public addCursor(cursor: Cursor) {
        this.map.set(cursor.clientId, cursor);
    } 
    public removeCursor(clientId: string) {
        this.map.delete(clientId);
    }

    public toList(): Cursor[] {
        const list: Cursor[] = [];
        for (const clientId of Object.keys(this.map)) {
            list.push(this.map.get(clientId)!);
        }
        return list;
    }

}