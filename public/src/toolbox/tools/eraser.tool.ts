import { type BoardMutationList } from '@shared/board/board-mutation.js';
import type { ReadonlyBoard } from '@shared/board/board.js';
import { Vec2 } from '@shared/utils/vec2.utils.js';
import { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';
import { BoardElementType } from '../../../../shared/board-elements/types/board-element-type.js';
import type { StrokeData } from '../../../../shared/board-elements/types/stroke-data.type.js';
import { ToolResult } from '../tool-result.js';
import { BaseTool } from './base.tool.js';
import { OvalEraserStrategy } from './eraser-strategy/oval.eraser-strategy.js';
import { StrokeEraserStrategy } from './eraser-strategy/stroke.eraser-strategy.js';

export class EraserTool extends BaseTool {
	private erasing: boolean = false;
	private resultingMutationList: BoardMutationList;
	private localToolResult: ToolResult = new ToolResult();
	private eraserRadius: number | undefined;

	constructor(readonly board: ReadonlyBoard) {
		super(board);
		this.resultingMutationList = [];
	}

	private erase(worldCoords: Vec2, eraserRadius: number): BoardMutationList {
		const closestElement = this.board.findClosestElementTo(worldCoords);
		if (!closestElement) return [];

		const distance = closestElement.distanceTo(worldCoords);
		if (distance > eraserRadius) return [];

		switch (closestElement.type) {
			case BoardElementType.Stroke:
				return StrokeEraserStrategy.apply(
					worldCoords,
					closestElement as StrokeBoardElement,
					this.localToolResult,
				);
			case BoardElementType.Oval:
				return OvalEraserStrategy.apply(closestElement, this.localToolResult);
			case BoardElementType.Rectangle:
				return OvalEraserStrategy.apply(closestElement, this.localToolResult);
		}
	}

	public override isConstructing(): boolean {
		return this.erasing;
	}

	public override startConstructing(worldCoords: Vec2, { size }: StrokeData): ToolResult | null {
		this.localToolResult.clear();
		this.erasing = true;

		this.eraserRadius = size;

		const mutations = this.erase(worldCoords, this.eraserRadius);
		this.resultingMutationList.push(...mutations);

		return this.localToolResult.addRenderBoardEmit();
	}

	public override stepConstructing(worldCoords: Vec2): ToolResult | null {
		if (!this.eraserRadius) return null; 
		this.localToolResult.clear();
		const mutations = this.erase(worldCoords, this.eraserRadius);
		this.resultingMutationList.push(...mutations);

		return this.localToolResult.addRenderBoardEmit();
	}

	public override endConstructing(): ToolResult | null {
		this.localToolResult.clear();
		const toolResult = new ToolResult()
			.setGlobalMutations(this.resultingMutationList)
			.addRenderBoardEmit();
		this.erasing = false;
		this.resultingMutationList = [];
		return toolResult;
	}
}
