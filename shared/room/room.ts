import type { Board, BoardDebugStats } from '../board/board.js';
import { RemoteCursorMap } from '../remote-cursor/remote-cursor-map.js';
import type { Cursor } from '../remote-cursor/types/cursor.js';

export interface RoomDebugStats {
    roomId: string;
    roomName: string; 
    
    boardDebugStats: BoardDebugStats;
}

export class Room {
    private initFlag: boolean = false; 
    
    private id: string | undefined; 
    private name: string | undefined; 
    private board: Board | undefined; 
    private remoteCursorMap: RemoteCursorMap = new RemoteCursorMap(); 

    constructor (private local: boolean = false) { 
        if (this.local)
            this.remoteCursorMap.addLocal();
    }

    public initialize (id: string, name: string, board: Board) {
        this.id = id;
        this.name = name;
        this.board = board;
    
        this.initFlag = true;
    }

    public isInitialized(): boolean {
        return this.initFlag;
    }
    
    public getName(): string {
        if (!this.initFlag) throw new Error('Calling get name on unitialized room'); 
        return this.name!; 
    }
    
    public getId(): string {
        if (!this.initFlag) throw new Error('Calling get id on unitialized room'); 
        return this.id!;
    }

    public getBoard(): Board {
        if (!this.initFlag) throw new Error('Calling get board on unitialized room'); 
        return this.board!; 
    }
    
    public getLocalCursor(): Cursor {
        const cursor = this.remoteCursorMap.getLocal();
        if (!cursor) throw new Error('Trying to retrieve local cursor from non-local room');
        return cursor;
    }
    public getCursorMap(): RemoteCursorMap {
        return this.remoteCursorMap;
    }
    public getForeignCursorList(): Cursor[] {
        return this.remoteCursorMap.foreignToList();
    }

    public getDebugStats(): RoomDebugStats {
        return {
            roomId: this.id ?? 'Unitialized',
            roomName: this.name ?? 'Unitialized',
            boardDebugStats: this.board?.getDebugStats() ?? {
                boardId: 'Unitialized',
                overallElementsAmount: -1,
                overallPointsAmount: -1
            }
        }
    }
}