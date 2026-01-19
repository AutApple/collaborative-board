import { Board } from '@shared/board/board.js';

export class AppContext {
    public board: Board;
    constructor() {
        this.board = new Board();
    }
}