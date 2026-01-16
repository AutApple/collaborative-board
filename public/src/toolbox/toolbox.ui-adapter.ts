import { SemanticEvents, type EventBus, type SemanticEventMap } from '../event-bus/index.js';
import { ToolboxTools } from './enums/toolbox-tools.enum.js';


interface ToolboxButtonDOMIds {
    pen: string,
    line: string;
}

export class ToolboxUiAdapter {
    private buttonIdMap: Record<ToolboxTools, string>;

    constructor(
        private document: Document,
        private semanticEventBus: EventBus<SemanticEventMap>,
        toolboxUiElementIds: ToolboxButtonDOMIds = {
            pen: 'toolbox-button-pen',
            line: 'toolbox-button-line'
        }) {
        this.buttonIdMap = {
            [ToolboxTools.Pen]: toolboxUiElementIds.pen,
            [ToolboxTools.Line]: toolboxUiElementIds.line
        };

        for (const tool of Object.keys(this.buttonIdMap) as ToolboxTools[]) {
            const element = this.document.getElementById(this.getDOMElementId(tool));
            if (!element)
                throw new Error(`Toolbox button not found: ${tool}`);
            element.addEventListener('click', _ => { this.semanticEventBus.emit(SemanticEvents.ToolboxChangeTool, { tool })});
        }
    }

    private getDOMElementId(button: ToolboxTools): string {
        const ret = this.buttonIdMap[button];
        if (!ret)
            throw Error('Toolbox button id is not defined');
        return ret;
    }

    public setActive(button: ToolboxTools) {
        const el = this.document.getElementById(this.getDOMElementId(button));
        if (el)
            el.classList.add("active");
    }
    public setInactive(button: ToolboxTools) {
        const el = this.document.getElementById(this.getDOMElementId(button));
        if (el)
            el.classList.remove("active");
    }
}