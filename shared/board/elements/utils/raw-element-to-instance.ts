import type { BaseBoardElement } from '../base.board-element.js';
import { LineBoardElement } from '../line-board-element.js';
import type { RawBoardElement, RawLineBoardElement } from '../raw/index.js';
import type { RawStrokeBoardElement } from '../raw/stroke.board-element.raw.js';
import { BoardElementType } from '../raw/types/board-element-type.js';
import { StrokeBoardElement } from '../stroke.board-element.js';


export function rawElementToInstance (raw: RawBoardElement): BaseBoardElement {
    switch (raw.type) {
        case BoardElementType.Stroke: 
            return StrokeBoardElement.fromRaw(raw as RawStrokeBoardElement, raw.id);
        case BoardElementType.Line:
            return LineBoardElement.fromRaw(raw as RawLineBoardElement, raw.id);
        default: 
            throw Error (`Unrecognized raw board element. Does board element registered properly?`);
    }    
}