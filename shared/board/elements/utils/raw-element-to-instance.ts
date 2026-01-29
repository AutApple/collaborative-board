import type { BaseBoardElement } from '../base.board-element.js';
import type { RawBoardElement  } from '../raw/index.js';
import type { RawStrokeBoardElement } from '../raw/stroke.board-element.raw.js';
import { BoardElementType } from '../raw/types/board-element-type.js';
import { StrokeBoardElement } from '../stroke.board-element.js';

// TODO: converge to static function in BaseBoardElement 
export function rawElementToInstance(raw: RawBoardElement): BaseBoardElement {
    switch (raw.type) {
        case BoardElementType.Stroke:
            return StrokeBoardElement.fromRaw(raw as RawStrokeBoardElement, raw.id);
        default:
            throw Error(`Unrecognized raw board element. Does board element registered properly?`);
    }
}