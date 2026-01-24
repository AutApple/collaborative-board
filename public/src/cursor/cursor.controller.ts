import type { Vec2, XY } from '../../../shared/types/vec2.type.js';
import type { AppContext } from '../app-context.js';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type LocalCursorMoveEvent, type RemoteCursorConnectEvent, type RemoteCursorDisconnectEvent, type RemoteCursorMoveEvent, type SemanticEventMap } from '../event-bus/index.js';
import type { NetworkService } from '../network/network.service.js';
import type { RemoteCursorUIAdapter } from './remote-cursor.ui-adapter.js';

export class CursorController {
   constructor (private appContext: AppContext, private uiAdapter: RemoteCursorUIAdapter, private networkService: NetworkService) {}
   public subscribe(bus: EventBus<SemanticEventMap>) {
        bus.on(SemanticEvents.RemoteCursorConnect, this.onRemoteCursorConnect.bind(this));
        bus.on(SemanticEvents.RemoteCursorDisconnect, this.onRemoteCursorDisconnect.bind(this));
        bus.on(SemanticEvents.RemoteCursorMove, this.onRemoteCursorMove.bind(this));
        bus.on(SemanticEvents.LocalCursorMove, this.onLocalCursorMove.bind(this));
   }
   
   public onRemoteCursorConnect({ cursor }: RemoteCursorConnectEvent) {
        this.appContext.remoteCursorList.addCursor(cursor);
        this.uiAdapter.addCursor(cursor.clientId, cursor.position);
   }

   public onRemoteCursorDisconnect({ clientId }: RemoteCursorDisconnectEvent) {
        this.appContext.remoteCursorList.removeCursor(clientId);
        this.uiAdapter.removeCursor(clientId);
   }

   public onRemoteCursorMove({ cursor }: RemoteCursorMoveEvent) {
     // update remote cursor with given id
     console.log('Hey?');
     this.uiAdapter.changeCursorPosition(cursor.clientId, cursor.position);
   }
   
   public onLocalCursorMove({ worldCoords: pos }: LocalCursorMoveEvent) {
     this.appContext.localCursorPosition = pos;
     this.networkService.sendLocalCursorMove(this.appContext.localCursorPosition);
   }

}