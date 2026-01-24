import { Vec2 } from '../../../shared/types/vec2.type.js';
import type { AppContext } from '../app-context.js';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type LocalCursorMoveEvent, type RemoteCursorConnectEvent, type RemoteCursorDisconnectEvent, type RemoteCursorMoveEvent, type SemanticEventMap } from '../event-bus/index.js';
import type { NetworkService } from '../network/network.service.js';
import type { RemoteCursorUIAdapter } from './remote-cursor.ui-adapter.js';

export class CursorController {
     private lastLocalMoveTime = 0;
     private readonly fpsCap = 60; // target fps of cursor updates
     private readonly minInterval = 1000 / this.fpsCap; // calculate ms per frame

     constructor(private appContext: AppContext, private uiAdapter: RemoteCursorUIAdapter, private networkService: NetworkService) { }
     
     private _checkTime(): boolean {
          const now = performance.now();
          if (now - this.lastLocalMoveTime < this.minInterval) return false; // skip if too soon

          this.lastLocalMoveTime = now;
          return true;
     }

     public subscribe(bus: EventBus<SemanticEventMap>) {
          bus.on(SemanticEvents.RemoteCursorConnect, this.onRemoteCursorConnect.bind(this));
          bus.on(SemanticEvents.RemoteCursorDisconnect, this.onRemoteCursorDisconnect.bind(this));
          bus.on(SemanticEvents.RemoteCursorMove, this.onRemoteCursorMove.bind(this));
          bus.on(SemanticEvents.LocalCursorMove, this.onLocalCursorMove.bind(this));
     }

     public onRemoteCursorConnect({ cursor }: RemoteCursorConnectEvent) {
          this.appContext.remoteCursorList.addCursor(cursor);
          this.uiAdapter.addCursor(cursor.clientId, this.appContext.camera.worldToScreen(Vec2.fromXY(cursor.worldCoords)));
     }

     public onRemoteCursorDisconnect({ clientId }: RemoteCursorDisconnectEvent) {
          this.appContext.remoteCursorList.removeCursor(clientId);
          this.uiAdapter.removeCursor(clientId);
     }

     public onRemoteCursorMove({ cursor }: RemoteCursorMoveEvent) {
          // update remote cursor with given id
          this.uiAdapter.changeCursorPosition(cursor.clientId, this.appContext.camera.worldToScreen(Vec2.fromXY(cursor.worldCoords)));
     }

     public onLocalCursorMove({ screenCoords }: LocalCursorMoveEvent) {
          if (!this._checkTime()) return; // should be throttled to prevent spamming with packets on server
          this.appContext.localCursorWorldCoords = this.appContext.camera.screenToWorld(screenCoords);
          this.networkService.sendLocalCursorMove(this.appContext.localCursorWorldCoords);
     }

}