import { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import type { AppContext } from '../app-context.js';
import type { EventBus } from '../event-bus/event-bus.js';
import {
	SemanticEvents,
	type LocalCursorMoveEvent,
	type RemoteCursorConnectEvent,
	type RemoteCursorDisconnectEvent,
	type RemoteCursorMoveEvent,
	type SemanticEventMap,
} from '../event-bus/index.js';
import type { NetworkService } from '../network/network.service.js';
import { RenderLayerType } from '../renderer/enums/render-layer.enum.js';
import type { RemoteCursorUIAdapter } from './remote-cursor.ui-adapter.js';

export class CursorController {
	constructor(
		private appContext: AppContext,
		private uiAdapter: RemoteCursorUIAdapter,
		private networkService: NetworkService,
	) {}

	public subscribe(bus: EventBus<SemanticEventMap>) {
		bus.on(SemanticEvents.RemoteCursorConnect, this.onRemoteCursorConnect.bind(this));
		bus.on(SemanticEvents.RemoteCursorDisconnect, this.onRemoteCursorDisconnect.bind(this));
		bus.on(SemanticEvents.RemoteCursorMove, this.onRemoteCursorMove.bind(this));
		bus.on(SemanticEvents.LocalCursorMove, this.onLocalCursorMove.bind(this));
	}

	public onRemoteCursorConnect({ clientId, worldCoordsPosition }: RemoteCursorConnectEvent) {
		this.uiAdapter.addCursor(
			clientId,
			this.appContext.camera.worldToScreen(Vec2.fromXY(worldCoordsPosition)),
		);
	}

	public onRemoteCursorDisconnect({ clientId }: RemoteCursorDisconnectEvent) {
		this.uiAdapter.removeCursor(clientId);
	}

	public onRemoteCursorMove({ clientId, worldCoordsPosition }: RemoteCursorMoveEvent) {
		// update remote cursor with given id
		this.uiAdapter.changeCursorPosition(
			clientId,
			this.appContext.camera.worldToScreen(Vec2.fromXY(worldCoordsPosition)),
		);
	}

	public onLocalCursorMove({ screenCoords }: LocalCursorMoveEvent) {
		const localCursor = this.appContext.room.getLocalClientData().cursor;
		if (!localCursor) throw new Error('No local cursor in cursor map. Is it initialized properly?');

		localCursor.position = this.appContext.camera.screenToWorld(screenCoords);
		this.networkService.sendLocalCursorMove(localCursor.position);

		this.appContext.renderer.setLayerDataAndRender(
			this.appContext.camera,
			RenderLayerType.StrokePreview,
			this.appContext.toolbox.getCurrentStrokeData(),
			this.appContext.camera.worldToScreen(Vec2.fromXY(localCursor.position)),
		);
	}
}
