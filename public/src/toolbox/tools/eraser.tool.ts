import { Vec2 } from '@shared/utils/vec2.utils.js';
import type { Board, ReadonlyBoard } from '@shared/board/board.js';
import {
	BoardMutationType,
	type BoardMutationList,
	type CreateBoardMutation,
	type RemoveBoardMutation,
	type UpdateBoardMutation,
} from '@shared/board/board-mutation.js';
import { BaseTool } from './base.tool.js';
import type { StrokeData } from '../../../../shared/board-elements/types/stroke-data.type.js';
import { ToolResult } from '../tool-result.js';
import { BoardElementType } from '../../../../shared/board-elements/types/board-element-type.js';
import { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';

export class EraserTool extends BaseTool {
	private erasing: boolean = false;
	private resultingMutationList: BoardMutationList;
	private eraserRadius: number = 3;
	private localToolResult: ToolResult = new ToolResult();

	constructor(readonly board: ReadonlyBoard) {
		super(board);
		this.resultingMutationList = [];
	}
	private removeElementAndMakeMutation(elementId: string): RemoveBoardMutation {
		this.localToolResult.addBoardAction((board) => board.removeElement(elementId));
		return {
			type: BoardMutationType.Remove,
			id: elementId,
		};
	}

	private erase(worldCoords: Vec2): BoardMutationList {
		const closestElement = this.board.findClosestElementTo(worldCoords);
		if (!closestElement) return [];
		if (closestElement.type !== BoardElementType.Stroke) return []; // TODO: define erase logic on the element itself
		const closestStrokeElement = closestElement as StrokeBoardElement;
		const point = closestStrokeElement.findClosestPointTo(worldCoords);
		const distance = point.distanceTo(worldCoords);

		if (distance > this.eraserRadius) return [];
		// 2 cases
		// 1 - point is either first or last point of the element. then we just remove the point.
		// 2 - point is in the middle. remove the point. get all of the points after it and put them into the buffer, while removing from the stroke
		// if there is no points left - completely dissolve the element
		// then append new stroke with these saved points
		const allPoints = closestStrokeElement.getVertices();
		let idx = 0;
		let minDist = Infinity;
		for (let i = 0; i < allPoints.length; i++) {
			const d = allPoints[i]!.distanceTo(point);
			if (d < minDist) {
				minDist = d;
				idx = i;
			}
		}
		if (idx === 0 || idx === allPoints.length - 1) {
			const updatedPoints = allPoints.filter((_, i) => i !== idx);

			if (updatedPoints.length < 1) return [this.removeElementAndMakeMutation(closestElement.id)];
			this.localToolResult.addBoardAction((board) => {
				board.updateElement(closestElement.id, {
					type: BoardElementType.Stroke,
					vertices: updatedPoints,
				});
			});
			let resMutation: UpdateBoardMutation = {
				type: BoardMutationType.Update,
				id: closestElement.id,
				payload: { type: BoardElementType.Stroke, vertices: updatedPoints },
			};
			return [resMutation];
		}
		const left = allPoints.slice(0, idx);
		const right = allPoints.slice(idx + 1);
		this.localToolResult.addBoardAction((board) => {
			board.updateElement(closestElement.id, { type: BoardElementType.Stroke, vertices: left });
		});

		const newElement = closestStrokeElement.clone();
		newElement.setVertices(right);
		this.localToolResult.addBoardAction((board) => {
			board.appendElement(newElement);
		});

		const updateMutation: UpdateBoardMutation = {
			type: BoardMutationType.Update,
			id: closestElement.id,
			payload: { type: BoardElementType.Stroke, vertices: left },
		};
		const createMutation: CreateBoardMutation = {
			type: BoardMutationType.Create,
			id: newElement.id,
			raw: newElement.toRaw(),
		};
		return [updateMutation, createMutation];
	}

	public override isConstructing(): boolean {
		return this.erasing;
	}

	public override startConstructing(worldCoords: Vec2, { size }: StrokeData): ToolResult | null {
		this.localToolResult.clear();
		this.erasing = true;

		this.eraserRadius = size;

		const mutations = this.erase(worldCoords);
		this.resultingMutationList.push(...mutations);

		return this.localToolResult.addRenderBoardEmit();
	}

	public override stepConstructing(worldCoords: Vec2): ToolResult | null {
		this.localToolResult.clear();
		const mutations = this.erase(worldCoords);
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
