import { validate, version } from 'uuid';
import { Vec2 } from '../utils/vec2.utils.js';
import {
	BoardMutationType,
	type BaseBoardMutation,
	type CreateBoardMutation,
	type RemoveBoardMutation,
	type UpdateBoardMutation,
} from './board-mutation.js';
import {
	BaseBoardElement,
	StrokeBoardElement,
	type AnyUpdateElementData,
} from '../board-elements/index.js';
import { BoardElementFactory } from '../board-elements/board-element-factory.js';
import { BoardElementType } from '../board-elements/types/board-element-type.js';

export interface BoardDebugStats {
	overallPointsAmount: number;
	overallElementsAmount: number;

	boardId: string;
	boardName: string;
}

export interface ReadonlyBoard {
	getElements: () => BaseBoardElement[];
	getLastElement: () => BaseBoardElement | undefined;
	findClosestElementTo: (worldCoords: Vec2) => BaseBoardElement | undefined;
	getDebugStats: () => BoardDebugStats;
}

export class Board implements ReadonlyBoard {
	constructor(
		private id?: string,
		private name?: string,
	) {}

	getName(): string | undefined {
		return this.name;
	}
	getId(): string | undefined {
		return this.id;
	}

	public setMetadata(metadata: { id?: string; name?: string }) {
		if (metadata.id !== undefined) this.id = metadata.id;
		if (metadata.name !== undefined) this.name = metadata.name;
	}

	private elements: BaseBoardElement[] = [];

	private resetData() {
		this.elements = [];
	}

	private validateId(id: string) {
		return validate(id) && version(id) === 4;
	}

	getElements() {
		return this.elements;
	}

	getLastElement(): BaseBoardElement | undefined {
		if (this.elements.length === 0) return undefined;
		return this.elements[this.elements.length - 1];
	}

	appendElement(element: BaseBoardElement) {
		if (!this.validateId(element.id)) return; // Check if element's id is valid
		this.elements.push(element);
		element.onAdd();
	}

	removeElement(elementId: string) {
		const elementToRemove = this.elements.find((el) => el.id === elementId);
		if (!elementToRemove) return;

		elementToRemove.onRemove();
		this.elements = this.elements.filter((el) => el.id !== elementId);
	}

	updateElement(elementId: string, payload: AnyUpdateElementData) {
		const element = this.elements.find((e) => e.id === elementId);
		if (!element) return;
		if (element.type !== payload.type)
			throw new Error(
				"On Board.updateElement: element with specified id doesn't match the type stated in a payload",
			);

		element.updateData(payload);
		element.onUpdate();
	}

	findClosestElementTo(
		worldCoords: Vec2,
		type?: BoardElementType | undefined,
	): BaseBoardElement | undefined {
		let minDistance = Infinity;
		let minElement: BaseBoardElement | undefined = undefined;
		for (const element of this.elements) {
			if (type !== undefined && element.type !== type) continue;
			const distance = element.distanceTo(worldCoords);
			const isNewMinDistance = minDistance > distance;
			minDistance = isNewMinDistance ? distance : minDistance;
			minElement = isNewMinDistance ? element : minElement;
		}
		return minElement;
	}

	refresh(data: BaseBoardElement[]) {
		this.resetData();
		for (const element of data) this.appendElement(element);
	}

	applyMutation(mutation: BaseBoardMutation) {
		switch (mutation.type) {
			case BoardMutationType.Create:
				const createMutation = mutation as CreateBoardMutation;
				if (!createMutation.element) throw Error('Wrong create board mutation signature'); // TODO: generic centralized messages
				const element = BoardElementFactory.fromRaw(createMutation.element);
				this.appendElement(element);
				// console.log('Created element with id ', element.id);
				break;
			case BoardMutationType.Remove:
				const removeMutation = mutation as RemoveBoardMutation;
				if (!removeMutation.id) throw Error('Wrong remove board mutation signature');
				this.removeElement(removeMutation.id);
				break;
			case BoardMutationType.Update:
				const updateMutation = mutation as UpdateBoardMutation;
				if (!updateMutation.id || !updateMutation.payload)
					throw Error('Wrong remove board mutation signature');
				this.updateElement(
					updateMutation.id,
					updateMutation.payload,
					// updateMutation.points.map((p) => Vec2.fromXY(p)),
				);
				break;
		}
	}

	getDebugStats(): BoardDebugStats {
		const debugStats: BoardDebugStats = {
			overallPointsAmount: 0,
			overallElementsAmount: this.elements.length,

			boardId: this.id ?? 'undefined',
			boardName: this.name ?? 'undefined'
		};
		for (const element of this.elements) {
			if (element.type !== BoardElementType.Stroke) continue;
			for (const point of (element as StrokeBoardElement).getVertices()) {
				debugStats.overallPointsAmount += 1;
			}
		}
		return debugStats;
	}
}
