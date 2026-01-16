import type { AppContext } from '../app-context.js';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type SemanticEventMap, type ToolboxChangeToolEvent } from '../event-bus/index.js';
import { ToolboxTools } from './enums/toolbox-tools.enum.js';
import type { ToolboxUiAdapter } from './toolbox.ui-adapter.js';

export class ToolboxController {
    private currentTool: ToolboxTools = ToolboxTools.Pen;
    
    constructor (private appContext: AppContext, private uiAdapter: ToolboxUiAdapter) {}
    
    public subscribe(bus: EventBus<SemanticEventMap>) {
        bus.on(SemanticEvents.ToolboxChangeTool, this.onToolboxChangeTool.bind(this));
    } 

    public onToolboxChangeTool(e: ToolboxChangeToolEvent) {
        this.uiAdapter.setInactive(this.currentTool);
        this.currentTool = e.tool;
        this.appContext.toolbox.changeTool(this.currentTool);
        this.uiAdapter.setActive(this.currentTool);
    }

}