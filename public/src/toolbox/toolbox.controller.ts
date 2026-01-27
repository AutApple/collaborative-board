import { Vec2 } from '../../../shared/types/vec2.type.js';
import type { AppContext } from '../app-context.js';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type SemanticEventMap, type ToolboxChangeStrokeColorEvent, type ToolboxChangeStrokeSizeEvent, type ToolboxChangeToolEvent } from '../event-bus/index.js';
import { RenderLayerType } from '../renderer/types/render-layer.type.js';
import { Tools } from './enums/tools.enum.js';
import type { ToolboxUiAdapter } from './toolbox.ui-adapter.js';

export class ToolboxController {
    private currentTool: Tools = Tools.Pen;

    constructor(private appContext: AppContext, private uiAdapter: ToolboxUiAdapter) { }

    public subscribe(bus: EventBus<SemanticEventMap>) {
        bus.on(SemanticEvents.ToolboxChangeTool, this.onToolboxChangeTool.bind(this));
        bus.on(SemanticEvents.ToolboxChangeStrokeColor, this.onToolboxChangeStrokeColor.bind(this));
        bus.on(SemanticEvents.ToolboxChangeStrokeSize, this.onToolboxChangeStrokeSize.bind(this));

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
        this.appContext.renderer.setLayerDataAndRender(
            this.appContext.camera,
            RenderLayerType.StrokePreview,
            this.appContext.toolbox.getCurrentStrokeData(),
            this.appContext.camera.worldToScreen(Vec2.fromXY(this.appContext.localCursorWorldCoords))
        );
    }
    public onToolboxChangeStrokeSize(e: ToolboxChangeStrokeSizeEvent) {
        this.appContext.toolbox.changeSize(e.value);
        this.uiAdapter.setStrokeSize(e.value);
        this.appContext.renderer.setLayerDataAndRender(
            this.appContext.camera,
            RenderLayerType.StrokePreview,
            this.appContext.toolbox.getCurrentStrokeData(),
            this.appContext.camera.worldToScreen(Vec2.fromXY(this.appContext.localCursorWorldCoords))
        );
    }

}