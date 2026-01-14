import type { Socket } from 'socket.io-client';
import type { Board } from './board/board.js';
import type { Renderer } from './renderer.js';
import { ServerBoardEvents } from '../../shared/socket-events/board.socket-events.js';
import type { Camera } from './camera/camera.js';
import type { BoardData } from '../../shared/types/board-data.type.js';
import { StrokeBoardElement } from '@shared/board-elements';
import type { RawStrokeBoardElement } from '../../shared/board-elements/raw/stroke.board-element.raw.js';

export class NetworkEventHandler {
    constructor(private socket: Socket, private board: Board, private camera: Camera, private renderer: Renderer) { }
    public registerEvents() {
        this.socket.on(ServerBoardEvents.AddStroke, (rawStrokeData: RawStrokeBoardElement) => {
            const stroke = StrokeBoardElement.fromRaw(rawStrokeData);
            this.board.appendStroke(stroke);
            this.renderer.renderBoard(this.board, this.camera);
        });
        this.socket.on(ServerBoardEvents.RefreshBoard, (rawData: RawStrokeBoardElement[]) => {
            const data = rawData.map((raw) => StrokeBoardElement.fromRaw(raw));
            this.board.refresh(data);
            this.renderer.renderBoard(this.board, this.camera);
        });
    }
}

