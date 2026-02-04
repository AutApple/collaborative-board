import {
	BoardMutationType,
	type CreateBoardMutation,
} from '../../../../shared/board/board-mutation.js';
import type { Board, ReadonlyBoard } from '../../../../shared/board/board.js';
import { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';
import type { StrokeData } from '../../../../shared/board-elements/types/stroke-data.type.js';
import { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import { ToolResult } from '../tool-result.js';
import { BaseTool } from './base.tool.js';
import { RectangleBoardElement } from '../../../../shared/board-elements/rectangle.board-element.js';

export class RectangleTool extends BaseTool {
	constructor(readonly board: ReadonlyBoard) {
		super(board);
	}
	private constructingRectanglePointer: RectangleBoardElement | null = null;

	public isConstructing(): boolean {
		return this.constructingRectanglePointer !== null;
	}

	public startConstructing(worldCoords: Vec2, strokeData: StrokeData): ToolResult | null {
		this.constructingRectanglePointer = new RectangleBoardElement(
			worldCoords,
			strokeData,
			worldCoords,
		);
		return new ToolResult()
			.addBoardAction((board) => board.appendElement(this.constructingRectanglePointer!))
			.addRenderBoardEmit();
	}
	public stepConstructing(worldCoords: Vec2): ToolResult | null {
		if (!this.isConstructing()) return null;
		this.constructingRectanglePointer!.setSecondPoint(worldCoords);
		return new ToolResult().addRenderBoardEmit();
	}
	public endConstructing(): ToolResult | null {
		if (!this.isConstructing()) return null;
		const mutation: CreateBoardMutation = {
			id: this.constructingRectanglePointer!.id,
			type: BoardMutationType.Create,
			raw: this.constructingRectanglePointer!.toRaw(),
		};
		this.constructingRectanglePointer = null;
		return new ToolResult().setGlobalMutations([mutation]).addRenderBoardEmit();
	}
}
