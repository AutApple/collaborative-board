import { Board } from '@shared/board/board.js';
import { RemoteCursorMap } from '../shared/remote-cursor/remote-cursor-list.js';

export class AppContext {
    public board: Board;
    public cursorMap: RemoteCursorMap;
    constructor() {
        this.board = new Board();
        this.cursorMap = new RemoteCursorMap();
    }
}