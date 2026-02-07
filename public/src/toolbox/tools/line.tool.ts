import type { Vec2 } from '@shared/utils/vec2.utils.js';
import type { Board, ReadonlyBoard } from '@shared/board/board.js';
import { BaseTool } from './base.tool.js';
import { BoardMutationType, type CreateBoardMutation } from '@shared/board/board-mutation.js';
import type { StrokeData } from '@shared/board-elements/types/stroke-data.type.js';
import { ToolResult } from '../tool-result.js';
import { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';

export class LineTool extends BaseTool {
	constructor(readonly board: ReadonlyBoard) {
		super(board);
	}

	private constructingLinePointer: StrokeBoardElement | null = null;

	public override isConstructing(): boolean {
		return !(this.constructingLinePointer === null);
	}

	public override startConstructing(worldCoords: Vec2, strokeData: StrokeData): ToolResult | null {
		const line = new StrokeBoardElement(worldCoords, { ...strokeData });
		this.constructingLinePointer = line;
		return new ToolResult()
			.addBoardAction((board) => board.appendElement(line))
			.addRenderBoardEmit();
	}

	public override stepConstructing(worldCoords: Vec2): ToolResult | null {
		this.constructingLinePointer?.setVertices([
			this.constructingLinePointer.getPosition(),
			worldCoords,
		]);
		return new ToolResult().addRenderBoardEmit();
	}

	public override endConstructing(): ToolResult | null {
		const raw = this.constructingLinePointer!.toRaw();
		const mutation: CreateBoardMutation = {
			type: BoardMutationType.Create,
			id: this.constructingLinePointer!.id,
			element: raw,
		};
		this.constructingLinePointer = null;
		return new ToolResult().setGlobalMutations([mutation]).addRenderBoardEmit();
	}
}
