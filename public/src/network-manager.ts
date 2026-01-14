import type { Socket } from 'socket.io-client';
import { ClientBoardEvents } from '../../shared/socket-events/board.socket-events.js';
import { StrokeBoardElement } from '@shared/board-elements/stroke.board-element.js';

export class NetworkManager {
    constructor (private socket: Socket) {}
    
    requestBoardRefresh() { 
        this.socket.emit(ClientBoardEvents.RequestRefresh); 
    }
    addStrokeToBoard(stroke: StrokeBoardElement) {
        this.socket.emit(ClientBoardEvents.Stroke, stroke); 
    }

}