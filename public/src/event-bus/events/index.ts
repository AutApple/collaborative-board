import type { RawBoardElement } from '@shared/board/elements/raw/index.js';
import type { Vec2 } from '@shared/types/vec2.type.js';
import type { Tools } from '../../toolbox/enums/tools.enum.js';
import type { BaseBoardMutation, BoardMutationList } from '@shared/board/board-mutation.js';

export enum SemanticEvents {
    BoardStartDrawing,
    BoardEndDrawing,
    BoardProcessDrawing,
    BoardMutations,
    BoardRefresh,
    BoardResize,

    CameraProcessPanning,
    CameraStartPanning,
    CameraEndPanning,
    CameraZoom,

    ToolboxChangeTool,
    ToolboxChangeStrokeColor,
    ToolboxChangeStrokeSize,

    BoardHistoryUndoAction,
    BoardHistoryRedoAction,
    BoardHistoryMutation
}


export type BoardStartDrawingEvent = { screenCoords: Vec2; };
export type BoardProcessDrawingEvent = { screenCoords: Vec2; };
export type BoardRefreshEvent = { rawData: RawBoardElement[]; };
export type BoardEndDrawingEvent = {};
export type BoardResizeEvent = { w: number, h: number; };
export type BoardMutationsEvent = { mutations: BoardMutationList; };

export type CameraStartPanningEvent = { screenCoords: Vec2; };
export type CameraProcessPanningEvent = { screenCoords: Vec2; };
export type CameraEndPanningEvent = {};
export type CameraZoomEvent = { screenCoords: Vec2; delta: number; };

export type ToolboxChangeToolEvent = { tool: Tools; };
export type ToolboxChangeStrokeColorEvent = { value: string; };
export type ToolboxChangeStrokeSizeEvent = { value: number; };

export type BoardHistoryUndoActionEvent = {};
export type BoardHistoryRedoActionEvent = {};
export type BoardHistoryMutationEvent = { mutation: BaseBoardMutation; };

export type SemanticEventMap = {
    // board
    [SemanticEvents.BoardStartDrawing]: BoardStartDrawingEvent,
    [SemanticEvents.BoardProcessDrawing]: BoardProcessDrawingEvent,
    [SemanticEvents.BoardEndDrawing]: BoardEndDrawingEvent,
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
    [SemanticEvents.ToolboxChangeStrokeColor]: ToolboxChangeStrokeColorEvent;
    [SemanticEvents.ToolboxChangeStrokeSize]: ToolboxChangeStrokeSizeEvent;
    // board history
    [SemanticEvents.BoardHistoryMutation]: BoardHistoryMutationEvent;
    [SemanticEvents.BoardHistoryRedoAction]: BoardHistoryRedoActionEvent;
    [SemanticEvents.BoardHistoryUndoAction]: BoardHistoryUndoActionEvent;
};