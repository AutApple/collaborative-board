import { Vec2 } from '@shared/utils/vec2.utils.js';
import type { Board } from '@shared/board/board.js';
import { Tools } from './enums/tools.enum.js';
import type { BaseTool } from './tools/base.tool.js';
import { LineTool } from './tools/line.tool.js';
import { StrokeTool } from './tools/stroke.tool.js';
import { EraserTool } from './tools/eraser.tool.js';
import type { StrokeData } from '@shared/board-elements/types/stroke-data.type.js';
import type { ToolResult } from './tool-result.js';
import { EyedropperTool } from './tools/eyedropper.tool.js';
import { RectangleTool } from './tools/rectangle.tool.js';
import { OvalTool } from './tools/oval.tool.js';
import { clientConfiguration } from '../config/client.config.js';

export class Toolbox {
	private currentTool: BaseTool | undefined;
	private currentStrokeData: StrokeData | undefined;
	public toolInstances: Record<Tools, BaseTool> | undefined;

	constructor(
		private defaultStrokeData: StrokeData,
		private defaultTool: Tools,
	) {}

	initialize(board: Board) {
		this.currentStrokeData = { ...this.defaultStrokeData };

		// make instances of a tools
		this.toolInstances = {
			[Tools.Pen]: new StrokeTool(board),
			[Tools.Line]: new LineTool(board),
			[Tools.Eraser]: new EraserTool(board),
			[Tools.Eyedropper]: new EyedropperTool(board),
			[Tools.Rectangle]: new RectangleTool(board),
			[Tools.Oval]: new OvalTool(board),
		};
		this.currentTool = this.toolInstances[this.defaultTool];
	}

	changeColor(color: string) {
		if (!this.currentStrokeData) throw new Error('Calling change color on unitialized toolbox');
		this.currentStrokeData.color = color;
	}
	changeSize(size: number) {
		if (!this.currentStrokeData) throw new Error('Calling change size on unitialized toolbox');
		this.currentStrokeData.size = size;
	}

	changeTool(tool: Tools) {
		if (!this.toolInstances) throw new Error('Calling change tool on unitialized toolbox');
		this.currentTool = this.toolInstances[tool];
	}
	getCurrentStrokeData(): StrokeData {
		if (!this.currentStrokeData) throw new Error('Calling get stroke data on unitialized toolbox');
		return this.currentStrokeData;
	}

	public isConstructing(): boolean {
		if (!this.currentTool) throw new Error('Calling is constructing on unitialized toolbox');
		return this.currentTool.isConstructing();
	}

	startConstructing(worldCoords: Vec2): ToolResult | null {
		if (!this.currentTool || !this.currentStrokeData)
			throw new Error('Calling construction on unitialized toolbox');
		if (this.isConstructing()) return null;
		return this.currentTool.startConstructing(worldCoords, this.currentStrokeData);
	}
	stepConstructing(worldCoords: Vec2): ToolResult | null {
		if (!this.currentTool) throw new Error('Calling construction on unitialized toolbox');
		if (!this.isConstructing()) return null;
		return this.currentTool.stepConstructing(worldCoords);
	}
	endConstructing(): ToolResult | null {
		if (!this.currentTool) throw new Error('Calling construction on unitialized toolbox');
		if (!this.isConstructing()) return null;
		return this.currentTool.endConstructing();
	}
}
