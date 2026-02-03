import type { Board, ReadonlyBoard } from '../../../../shared/board/board.js';
import type { StrokeData } from '../../../../shared/board-elements/types/stroke-data.type.js';
import type { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import { clientConfiguration } from '../../config/client.config.js';
import { SemanticEvents } from '../../event-bus/index.js';
import { ToolResult } from '../tool-result.js';
import { BaseTool } from './base.tool.js';
import { BoardElementType } from '../../../../shared/board-elements/types/board-element-type.js';
import type { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';

export class EyedropperTool extends BaseTool {
	constructor(readonly board: ReadonlyBoard) {
		super(board);
	}
	public isConstructing(): boolean {
		return this.picking;
	}
	private picking = false;
	private pickColor(worldCoords: Vec2): string {
		const defaultColor = clientConfiguration.boardBackgroundColor;
		const element = this.board.findClosestElementTo(worldCoords);
		if (!element) return defaultColor;
		if (element.type !== BoardElementType.Stroke) return defaultColor; // TODO: color picking defined on an element itself

		const strokeElement = element as StrokeBoardElement;

		const distance = strokeElement.findClosestPointTo(worldCoords).distanceTo(worldCoords);
		if (distance > strokeElement.getStrokeData().size) return defaultColor;
		return strokeElement.getStrokeData().color;
	}
	private pickColorAndMakeToolResult(worldCoords: Vec2): ToolResult {
		return new ToolResult().addEmitAction((bus) => {
			bus.emit(SemanticEvents.ToolboxChangeStrokeColor, {
				value: this.pickColor(worldCoords),
			});
		});
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
