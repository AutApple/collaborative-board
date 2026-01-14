import type { Socket } from 'socket.io-client';
import type { Board } from './board/board.js';
import type { Renderer } from './renderer.js';
import type { Camera } from './camera/camera.js';

import { ServerBoardEvents } from '@shared/socket-events/board.socket-events.js';
import type { RawBoardElement } from '@shared/board-elements/raw/';
import { rawElementToInstance } from '@shared/board-elements/utils/raw-element-to-instance.js'

export class NetworkEventHandler {
    constructor(private socket: Socket, private board: Board, private camera: Camera, private renderer: Renderer) { }
    public registerEvents() {
        this.socket.on(ServerBoardEvents.AddElement, (rawElement: RawBoardElement) => {
            const element = rawElementToInstance(rawElement);
            this.board.appendElement(element);
            this.renderer.renderBoard(this.board, this.camera);
        });

        this.socket.on(ServerBoardEvents.RefreshBoard, (rawData: RawBoardElement[]) => {
            const data = rawData.map((raw) => rawElementToInstance(raw));
            this.board.refresh(data);
            this.renderer.renderBoard(this.board, this.camera);
        });
    }
}

