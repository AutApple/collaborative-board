import { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import type { AppContext } from '../app-context.js';
import { clientConfiguration } from '../config/client.config.js';
import type { EventBus } from '../event-bus/event-bus.js';
import {
	SemanticEvents,
	type SemanticEventMap,
	type ToolboxChangeStrokeColorEvent,
	type ToolboxChangeStrokeSizeEvent,
	type ToolboxChangeToolEvent,
	type ToolProcessUsingEvent,
	type ToolStartUsingEvent,
} from '../event-bus/index.js';
import type { NetworkService } from '../network/network.service.js';
import { RenderLayerType } from '../renderer/enums/render-layer.enum.js';
import { Tools } from './enums/tools.enum.js';
import type { ToolboxUiAdapter } from './toolbox.ui-adapter.js';

export class ToolboxController {
	private currentTool: Tools = clientConfiguration.defaultTool;

	constructor(
		private appContext: AppContext,
		private uiAdapter: ToolboxUiAdapter,
		private networkService: NetworkService,
	) {}

	public subscribe(bus: EventBus<SemanticEventMap>) {
		bus.on(SemanticEvents.ToolboxChangeTool, this.onToolboxChangeTool.bind(this));
		bus.on(SemanticEvents.ToolboxChangeStrokeColor, this.onToolboxChangeStrokeColor.bind(this));
		bus.on(SemanticEvents.ToolboxChangeStrokeSize, this.onToolboxChangeStrokeSize.bind(this));

		bus.on(SemanticEvents.ToolStartUsing, (e) => {
			this.onToolStartUsing(e, bus);
		});
		bus.on(SemanticEvents.ToolProcessUsing, (e) => {
			this.onToolProcessUsing(e, bus);
		});
		bus.on(SemanticEvents.ToolEndUsing, () => {
			this.onToolEndUsing(bus);
		});
	}

	public onToolboxChangeTool(e: ToolboxChangeToolEvent) {
		this.uiAdapter.setInactive(this.currentTool);
		this.currentTool = e.tool;
		this.appContext.toolbox.changeTool(this.currentTool);
		this.uiAdapter.setActive(this.currentTool);
	}

	public onToolboxChangeStrokeColor(e: ToolboxChangeStrokeColorEvent) {
		this.appContext.toolbox.changeColor(e.value);
		this.uiAdapter.setStrokeColor(e.value);

		const localCursor = this.appContext.room.getLocalCursor();

		this.appContext.renderer.setLayerDataAndRender(
			this.appContext.camera,
			RenderLayerType.StrokePreview,
			this.appContext.toolbox.getCurrentStrokeData(),
			this.appContext.camera.worldToScreen(Vec2.fromXY(localCursor.worldCoords)),
		);
	}
	public onToolboxChangeStrokeSize(e: ToolboxChangeStrokeSizeEvent) {
		this.appContext.toolbox.changeSize(e.value);
		this.uiAdapter.setStrokeSize(e.value);
		const localCursor = this.appContext.room.getLocalCursor();
		this.appContext.renderer.setLayerDataAndRender(
			this.appContext.camera,
			RenderLayerType.StrokePreview,
			this.appContext.toolbox.getCurrentStrokeData(),
			this.appContext.camera.worldToScreen(Vec2.fromXY(localCursor.worldCoords)),
		);
	}

	private onToolStartUsing(e: ToolStartUsingEvent, bus: EventBus<SemanticEventMap>) {
		const toolResult = this.appContext.toolbox.startConstructing(
			this.appContext.camera.screenToWorld(e.screenCoords),
		);
		if (toolResult !== null) toolResult.apply(this.appContext, this.networkService, bus);
	}

	private onToolEndUsing(bus: EventBus<SemanticEventMap>) {
		const toolResult = this.appContext.toolbox.endConstructing();
		if (toolResult !== null) toolResult.apply(this.appContext, this.networkService, bus);
	}

	private onToolProcessUsing(e: ToolProcessUsingEvent, bus: EventBus<SemanticEventMap>) {
		// TODO: stroke streaming
		const toolResult = this.appContext.toolbox.stepConstructing(
			this.appContext.camera.screenToWorld(e.screenCoords),
		);
		if (toolResult !== null) toolResult.apply(this.appContext, this.networkService, bus);
	}
}
