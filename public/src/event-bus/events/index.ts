import type { RawBoardElement } from '@shared/board-elements/raw/index.js';
import type { Point } from '@shared/types/point.type.js';

export enum SemanticEvents {
    BoardStartDrawing,
    BoardEndDrawing,
    BoardProcessDrawing,
    BoardElementAdd,
    BoardRefresh,
    BoardResize,

    CameraProcessPanning,
    CameraStartPanning,
    CameraEndPanning,
    CameraZoom
}


export type BoardStartDrawingEvent = { screenCoords: Point; };
export type BoardProcessDrawingEvent = { screenCoords: Point; };
export type BoardElementAddEvent = { rawElementData: RawBoardElement; };
export type BoardRefreshEvent = { rawData: RawBoardElement[]; };
export type BoardEndDrawingEvent = {};
export type BoardResizeEvent = { w: number, h: number; };

export type CameraStartPanningEvent = { screenCoords: Point; };
export type CameraProcessPanningEvent = { screenCoords: Point; };
export type CameraEndPanningEvent = {};
export type CameraZoomEvent = { screenCoords: Point; delta: number; };

export type SemanticEventMap = {
    // board
    [SemanticEvents.BoardStartDrawing]: BoardStartDrawingEvent,
    [SemanticEvents.BoardProcessDrawing]: BoardProcessDrawingEvent,
    [SemanticEvents.BoardEndDrawing]: BoardEndDrawingEvent,
    [SemanticEvents.BoardElementAdd]: BoardElementAddEvent,
    [SemanticEvents.BoardRefresh]: BoardRefreshEvent,
    [SemanticEvents.BoardResize]: BoardResizeEvent,
    // camera
    [SemanticEvents.CameraStartPanning]: CameraStartPanningEvent,
    [SemanticEvents.CameraProcessPanning]: CameraProcessPanningEvent,
    [SemanticEvents.CameraEndPanning]: CameraEndPanningEvent,
    [SemanticEvents.CameraZoom]: CameraZoomEvent,
    
};