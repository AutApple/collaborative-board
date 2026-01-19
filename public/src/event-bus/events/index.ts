import type { RawBoardElement } from '@shared/board/elements/raw/index.js';
import type { Point } from '@shared/types/point.type.js';
import type { Tools } from '../../toolbox/enums/tools.enum.js';
import type { BoardMutationList } from '@shared/board/board-mutation.js';

export enum SemanticEvents {
    BoardStartDrawing,
    BoardEndDrawing,
    BoardProcessDrawing,
    // BoardElementAdd,
    BoardMutations,
    BoardRefresh,
    BoardResize,

    CameraProcessPanning,
    CameraStartPanning,
    CameraEndPanning,
    CameraZoom,

    ToolboxChangeTool,
}


export type BoardStartDrawingEvent = { screenCoords: Point; };
export type BoardProcessDrawingEvent = { screenCoords: Point; };
// export type BoardElementAddEvent = { rawElementData: RawBoardElement; };
export type BoardRefreshEvent = { rawData: RawBoardElement[]; };
export type BoardEndDrawingEvent = {};
export type BoardResizeEvent = { w: number, h: number; };
export type BoardMutationsEvent = { mutations: BoardMutationList; };

export type CameraStartPanningEvent = { screenCoords: Point; };
export type CameraProcessPanningEvent = { screenCoords: Point; };
export type CameraEndPanningEvent = {};
export type CameraZoomEvent = { screenCoords: Point; delta: number; };

export type ToolboxChangeToolEvent = { tool: Tools; };

export type SemanticEventMap = {
    // board
    [SemanticEvents.BoardStartDrawing]: BoardStartDrawingEvent,
    [SemanticEvents.BoardProcessDrawing]: BoardProcessDrawingEvent,
    [SemanticEvents.BoardEndDrawing]: BoardEndDrawingEvent,
    // [SemanticEvents.BoardElementAdd]: BoardElementAddEvent,
    [SemanticEvents.BoardRefresh]: BoardRefreshEvent,
    [SemanticEvents.BoardResize]: BoardResizeEvent,
    [SemanticEvents.BoardMutations]: BoardMutationsEvent;

    // camera
    [SemanticEvents.CameraStartPanning]: CameraStartPanningEvent,
    [SemanticEvents.CameraProcessPanning]: CameraProcessPanningEvent,
    [SemanticEvents.CameraEndPanning]: CameraEndPanningEvent,
    [SemanticEvents.CameraZoom]: CameraZoomEvent,
    // toolbox
    [SemanticEvents.ToolboxChangeTool]: ToolboxChangeToolEvent;
};