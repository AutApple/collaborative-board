import type { Socket } from 'socket.io-client';
import { ClientBoardEvents } from '@shared/socket-events/board.socket-events.js';
import type { BaseBoardElement } from '@shared/board/elements/base.board-element.js';

export class NetworkManager {
    constructor (private socket: Socket) {}
    
    requestBoardRefresh() { 
        this.socket.emit(ClientBoardEvents.RequestRefresh); 
    }
    addElementToBoard(element: BaseBoardElement) {
        this.socket.emit(ClientBoardEvents.AddElement, element.toRaw()); 
    }

}