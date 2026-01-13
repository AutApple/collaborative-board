import type { Socket } from 'socket.io-client';
import { ClientBoardEvents } from '../../shared/socket-events/board.socket-events.js';
import type { Stroke } from '@shared/types';

export class NetworkManager {
    constructor (private socket: Socket) {}
    
    requestBoardRefresh() { 
        this.socket.emit(ClientBoardEvents.RequestRefresh); 
    }
    addStrokeToBoard(stroke: Stroke) {
        this.socket.emit(ClientBoardEvents.Stroke, stroke); 
    }

}