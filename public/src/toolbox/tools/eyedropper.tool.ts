import type { Board } from '../../../../shared/board/board.js';
import type { StrokeData } from '../../../../shared/board/elements/types/stroke-data.type.js';
import type { Vec2 } from '../../../../shared/types/vec2.type.js';
import { SemanticEvents } from '../../event-bus/index.js';
import { ToolResult } from '../tool-result.js';
import { BaseTool } from './base.tool.js';

export class EyedropperTool extends BaseTool {
    constructor (board: Board) { super(board); }
    public isConstructing(): boolean {
        return this.picking; 
    }
    private picking = false;
    private pickColor(worldCoords: Vec2): string {
        // TODO: check for actual stroke dots, not vertecies
        const defaultColor = '#ffffff'; // TODO: return something that is configured as background color; 
        const element = this.board.findClosestElementTo(worldCoords);
        if (!element) return defaultColor;
        const distance = element.findClosestVertexTo(worldCoords).distanceTo(worldCoords); 
        if (distance > 1.1 * element.getStrokeData().size) return defaultColor; // TODO: put this hardcoded value into config as well
        return element.getStrokeData().color;
    }
    private pickColorAndMakeToolResult(worldCoords: Vec2): ToolResult {
        return new ToolResult().addEmitAction((bus) => {
            bus.emit(SemanticEvents.ToolboxChangeStrokeColor, {value: this.pickColor(worldCoords)});
        })
    }

    public startConstructing(worldCoords: Vec2, _: StrokeData): ToolResult | null {
        this.picking = true;
        return this.pickColorAndMakeToolResult(worldCoords);
    }
    public stepConstructing(worldCoords: Vec2): ToolResult | null { 
        return this.pickColorAndMakeToolResult(worldCoords);
    }
    public endConstructing(): ToolResult | null {
        this.picking = false;
        return null;
    }

}