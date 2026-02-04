import {
	BoardMutationType,
	type CreateBoardMutation,
} from '../../../../shared/board/board-mutation.js';
import type { Board, ReadonlyBoard } from '../../../../shared/board/board.js';
import { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';
import type { StrokeData } from '../../../../shared/board-elements/types/stroke-data.type.js';
import { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import { clientConfiguration } from '../../config/client.config.js';
import { ToolResult } from '../tool-result.js';
import { BaseTool } from './base.tool.js';
import { OvalBoardElement } from '../../../../shared/board-elements/oval.board-element.js';

export class OvalTool extends BaseTool {
	constructor(readonly board: ReadonlyBoard) {
		super(board);
	}
	private constructingOvalPointer: OvalBoardElement | null = null;

	public isConstructing(): boolean {
		return this.constructingOvalPointer !== null;
	}

	public startConstructing(worldCoords: Vec2, strokeData: StrokeData): ToolResult | null {
		this.constructingOvalPointer = new OvalBoardElement(worldCoords, strokeData, worldCoords);
		return new ToolResult()
			.addBoardAction((board) => board.appendElement(this.constructingOvalPointer!))
			.addRenderBoardEmit();
	}
	public stepConstructing(worldCoords: Vec2): ToolResult | null {
		this.constructingOvalPointer!.setSecondPoint(worldCoords);
		return new ToolResult().addRenderBoardEmit();
	}
	public endConstructing(): ToolResult | null {
		const mutation: CreateBoardMutation = {
			id: this.constructingOvalPointer!.id,
			type: BoardMutationType.Create,
			raw: this.constructingOvalPointer!.toRaw(),
		};
		this.constructingOvalPointer = null;
		return new ToolResult().setGlobalMutations([mutation]).addRenderBoardEmit();
	}
}
