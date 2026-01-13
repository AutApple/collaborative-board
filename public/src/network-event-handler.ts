import type { Socket } from 'socket.io-client';
import type { Board } from './board/board.js';
import type { Renderer } from './renderer.js';
import { ServerBoardEvents } from '../../shared/socket-events/board.socket-events.js';
import type { Stroke } from '../../shared/types/stroke.type.js';
import type { Camera } from './camera.js';
import type { BoardData } from '../../shared/types/board-data.type.js';

export class NetworkEventHandler {
    constructor(private socket: Socket, private board: Board, private camera: Camera, private renderer: Renderer) { }
    public registerEvents() {
        this.socket.on(ServerBoardEvents.AddStroke, (stroke: Stroke) => {
            this.board.appendStroke(stroke);
            this.renderer.renderBoard(this.board, this.camera);
        });
        this.socket.on(ServerBoardEvents.RefreshBoard, (data: BoardData) => {
            this.board.refresh(data);
            this.renderer.renderBoard(this.board, this.camera);
        });

    }
}

