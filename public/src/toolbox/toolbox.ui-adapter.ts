import { SemanticEvents, type EventBus, type SemanticEventMap } from '../event-bus/index.js';
import { Tools } from './enums/tools.enum.js';


interface ToolboxElementDOMIds {
    pen_button: string,
    line_button: string,
    eraser_button: string;

    color_setting: string;
    stroke_setting: string;
}

export class ToolboxUiAdapter {
    private buttonIdMap: Record<Tools, string>;
    
    constructor(
        private document: Document,
        private semanticEventBus: EventBus<SemanticEventMap>,
        toolboxUiElementIds: ToolboxElementDOMIds = {
            pen_button: 'toolbox-button-pen',
            line_button: 'toolbox-button-line',
            eraser_button: 'toolbox-button-eraser',

            color_setting: 'toolbox-setting-color',
            stroke_setting: 'toolbox-setting-stroke'
        }) {
        
        
        // Map of tools mapped to corresponding buttons 
        this.buttonIdMap = {
            [Tools.Pen]: toolboxUiElementIds.pen_button,
            [Tools.Line]: toolboxUiElementIds.line_button,
            [Tools.Eraser]: toolboxUiElementIds.eraser_button
        };

        for (const tool of Object.keys(this.buttonIdMap) as Tools[]) {
            const element = this.document.getElementById(this.getDOMElementId(tool));
            if (!element)
                throw new Error(`Toolbox button component not found: ${tool}`);
            element.addEventListener('click', _ => { this.semanticEventBus.emit(SemanticEvents.ToolboxChangeTool, { tool }); });
        }

        const colorPickerElement = this.document.getElementById(toolboxUiElementIds.color_setting);
        if (!colorPickerElement) throw new Error(`Color picker component not found. Did you spell id correctly? Id: ${toolboxUiElementIds.color_setting}`);
        
        const strokePickerElement = this.document.getElementById(toolboxUiElementIds.stroke_setting);
        if (!strokePickerElement) throw new Error(`Stroke size picker component not found. Did you spell id correctly? Id: ${toolboxUiElementIds.stroke_setting}`);

        colorPickerElement.addEventListener('input', e => {
            this.semanticEventBus.emit(SemanticEvents.ToolboxChangeStrokeColor, {value: (e.target as HTMLInputElement).value});
        });
        strokePickerElement.addEventListener('input', e => {
            this.semanticEventBus.emit(SemanticEvents.ToolboxChangeStrokeSize, {value: +(e.target as HTMLInputElement).value});
        });
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