import { SemanticEvents, type EventBus, type SemanticEventMap } from '../event-bus/index.js';
import { Tools } from './enums/tools.enum.js';


interface ToolboxButtonDOMIds {
    pen: string,
    line: string,
    eraser: string;
}

export class ToolboxUiAdapter {
    private buttonIdMap: Record<Tools, string>;

    constructor(
        private document: Document,
        private semanticEventBus: EventBus<SemanticEventMap>,
        toolboxUiElementIds: ToolboxButtonDOMIds = {
            pen: 'toolbox-button-pen',
            line: 'toolbox-button-line',
            eraser: 'toolbox-button-eraser'
        }) {
        this.buttonIdMap = {
            [Tools.Pen]: toolboxUiElementIds.pen,
            [Tools.Line]: toolboxUiElementIds.line,
            [Tools.Eraser]: toolboxUiElementIds.eraser
        };

        for (const tool of Object.keys(this.buttonIdMap) as Tools[]) {
            const element = this.document.getElementById(this.getDOMElementId(tool));
            if (!element)
                throw new Error(`Toolbox button not found: ${tool}`);
            element.addEventListener('click', _ => { this.semanticEventBus.emit(SemanticEvents.ToolboxChangeTool, { tool }); });
        }
    }

    private getDOMElementId(button: Tools): string {
        const ret = this.buttonIdMap[button];
        if (!ret)
            throw Error('Toolbox button id is not defined');
        return ret;
    }

    public setActive(button: Tools) {
        const el = this.document.getElementById(this.getDOMElementId(button));
        if (el)
            el.classList.add("active");
    }
    public setInactive(button: Tools) {
        const el = this.document.getElementById(this.getDOMElementId(button));
        if (el)
            el.classList.remove("active");
    }
}