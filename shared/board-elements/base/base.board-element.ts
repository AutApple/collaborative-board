import { Vec2 } from '../../utils/vec2.utils.js';
import type { AnyRawBoardElement, AnyUpdateElementData } from '../index.js';
import type { BoardElementType } from '../types/board-element-type.js';

export interface BaseUpdateElementData {
	type: BoardElementType;
}

export interface RawBaseBoardElement {
	type: BoardElementType;
	id: string;
	pos: Vec2;
}

export abstract class BaseBoardElement {
	protected _id: string;
	protected pos: Vec2 = new Vec2(0, 0);
	public abstract readonly type: BoardElementType;

	constructor(pos: Vec2, id?: string | undefined) {
		this._id = id ?? crypto.randomUUID();
		this.pos.set(pos);
	}

	public get position() {
		return this.pos;
	}

	public get id() {
		return this._id;
	}

	// Custom handlers for board actions
	public abstract onAdd(): void;
	public abstract onUpdate(): void;
	public abstract onRemove(): void;

	public abstract clone(): BaseBoardElement;

	public abstract updateData(payload: AnyUpdateElementData): void;
	public abstract toUpdateData(): AnyUpdateElementData;

	public abstract distanceTo(worldCoords: Vec2): number;

	public abstract toRaw(): AnyRawBoardElement;
	
	public abstract encode(): ArrayBuffer;

	// Subclasses must implement static fromEncoded() and fromRaw()
	public static fromEncoded(buffer: ArrayBuffer, id: string): BaseBoardElement {
		throw new Error('Method is not callable from base class.');	
	};
	public static fromRaw(raw: AnyRawBoardElement): BaseBoardElement {
		throw new Error('Method is not callable from base class.');	
	}; 
	
	public abstract pickColor(worldCoords: Vec2): string | null;
}
