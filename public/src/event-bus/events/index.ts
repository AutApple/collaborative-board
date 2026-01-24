import type { RawBoardElement } from '@shared/board/elements/raw/index.js';
import type { Vec2 } from '@shared/types/vec2.type.js';
import type { Tools } from '../../toolbox/enums/tools.enum.js';
import type { BaseBoardMutation, BoardMutationList } from '@shared/board/board-mutation.js';
import type { Cursor } from '../../../../shared/remote-cursor/types/cursor.js';

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
    BoardHistoryMutations,

    RemoteCursorConnect,
    RemoteCursorDisconnect,
    RemoteCursorMove,
    LocalCursorMove
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
export type BoardHistoryMutationsEvent = { mutations: BoardMutationList; };

export type RemoteCursorConnectEvent = { cursor: Cursor };
export type RemoteCursorDisconnectEvent = { clientId: string };
export type RemoteCursorMoveEvent = { cursor: Cursor };
export type LocalCursorMoveEvent = { screenCoords: Vec2 };

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
    [SemanticEvents.BoardHistoryMutations]: BoardHistoryMutationsEvent;
    [SemanticEvents.BoardHistoryRedoAction]: BoardHistoryRedoActionEvent;
    [SemanticEvents.BoardHistoryUndoAction]: BoardHistoryUndoActionEvent;
    //cursors
    [SemanticEvents.RemoteCursorConnect]: RemoteCursorConnectEvent
    [SemanticEvents.RemoteCursorDisconnect]: RemoteCursorDisconnectEvent
    [SemanticEvents.RemoteCursorMove]: RemoteCursorMoveEvent
    [SemanticEvents.LocalCursorMove]: LocalCursorMoveEvent
   
};