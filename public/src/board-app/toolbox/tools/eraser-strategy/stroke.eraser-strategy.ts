import {
	BoardMutationType,
	type BoardMutationList,
	type CreateBoardMutation,
	type UpdateBoardMutation,
} from '@shared/board/board-mutation.js';
import type { ToolResult } from '../../tool-result.js';
import type { StrokeBoardElement } from '../../../../../../shared/board-elements/stroke.board-element.js';
import type { Vec2 } from '../../../../../../shared/utils/vec2.utils.js';
import { BoardElementType } from '../../../../../../shared/board-elements/types/board-element-type.js';
import { RemoveEraserStrategy } from './base/remove.eraser-strategy.js';

export class StrokeEraserStrategy {
	static apply(
		worldCoords: Vec2,
		element: StrokeBoardElement,
		toolResult: ToolResult,
	): BoardMutationList {
		// 2 cases
		// 1 - point is either first or last point of the element. then we just remove the point.
		// 2 - point is in the middle. remove the point. get all of the points after it and put them into the buffer, while removing from the stroke
		// if there is no points left - completely dissolve the element
		// then append new stroke with these saved points
		const point = element.findClosestPointTo(worldCoords);
		const allPoints = element.getVertices();

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

			if (updatedPoints.length < 1) return RemoveEraserStrategy.apply(element, toolResult);

			let resMutation: UpdateBoardMutation = {
				type: BoardMutationType.Update,
				id: element.id,
				inversePayload: element.toUpdateData(),
				payload: { type: BoardElementType.Stroke, vertices: updatedPoints },
			};

			toolResult.addBoardAction((board) => {
				board.updateElement(element.id, {
					type: BoardElementType.Stroke,
					vertices: updatedPoints,
				});
			});
			return [resMutation];
		}
		const left = allPoints.slice(0, idx);
		const right = allPoints.slice(idx + 1);
		toolResult.addBoardAction((board) => {
			board.updateElement(element.id, { type: BoardElementType.Stroke, vertices: left });
		});

		const newElement = element.clone();
		newElement.setVertices(right);
		toolResult.addBoardAction((board) => {
			board.appendElement(newElement);
		});

		const updateMutation: UpdateBoardMutation = {
			type: BoardMutationType.Update,
			id: element.id,
			inversePayload: element.toUpdateData(),
			payload: { type: BoardElementType.Stroke, vertices: left },
		};
		const createMutation: CreateBoardMutation = {
			type: BoardMutationType.Create,
			id: newElement.id,
			element: newElement.toRaw(),
		};
		return [updateMutation, createMutation];
	}
}
