import type { AnyRawBoardElement } from '../../../../../shared/board-elements/index.js';
import type { BoardMutationList } from '@shared/board/board-mutation.js';
import type { Vec2 } from '@shared/utils/vec2.utils.js';
import type { BaseBoardElement } from '../../../../../shared/board-elements/base/base.board-element.js';
import type { Cursor } from '../../../../../shared/remote-cursor/types/cursor.js';
import type { Tools } from '../../toolbox/enums/tools.enum.js';
import type { RoomDebugStats } from '../../../../../shared/room/room.js';

export enum SemanticEvents {
	ToolStartUsing,
	ToolEndUsing,
	ToolProcessUsing,
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
	LocalCursorMove,

	RendererRedrawBoard,

	TopPanelExportBoard,
	TopPanelCopyLink,
}

export type ToolStartUsingEvent = { screenCoords: Vec2 };
export type ToolProcessUsingEvent = { screenCoords: Vec2 };
export type BoardRefreshEvent = { rawData: AnyRawBoardElement[] };
export type ToolEndUsingEvent = {};
export type BoardResizeEvent = { w: number; h: number };
export type BoardMutationsEvent = { mutations: BoardMutationList };

export type CameraStartPanningEvent = { screenCoords: Vec2 };
export type CameraProcessPanningEvent = { screenCoords: Vec2 };
export type CameraEndPanningEvent = {};
export type CameraZoomEvent = { screenCoords: Vec2; delta: number };

export type ToolboxChangeToolEvent = { tool: Tools };
export type ToolboxChangeStrokeColorEvent = { value: string };
export type ToolboxChangeStrokeSizeEvent = { value: number };

export type BoardHistoryUndoActionEvent = {};
export type BoardHistoryRedoActionEvent = {};
export type BoardHistoryMutationsEvent = { mutations: BoardMutationList };

export type RemoteCursorConnectEvent = { cursor: Cursor };
export type RemoteCursorDisconnectEvent = { clientId: string };
export type RemoteCursorMoveEvent = { cursor: Cursor };
export type LocalCursorMoveEvent = { screenCoords: Vec2 };

export type RendererRedrawBoardEvent = {
	elements: BaseBoardElement[];
	debugStats: RoomDebugStats;
};

export type TopPanelExportBoardEvent = {};
export type TopPanelCopyLinkEvent = {};

export type SemanticEventMap = {
	// board
	[SemanticEvents.ToolStartUsing]: ToolStartUsingEvent;
	[SemanticEvents.ToolProcessUsing]: ToolProcessUsingEvent;
	[SemanticEvents.ToolEndUsing]: ToolEndUsingEvent;
	[SemanticEvents.BoardRefresh]: BoardRefreshEvent;
	[SemanticEvents.BoardResize]: BoardResizeEvent;
	[SemanticEvents.BoardMutations]: BoardMutationsEvent;
	// camera
	[SemanticEvents.CameraStartPanning]: CameraStartPanningEvent;
	[SemanticEvents.CameraProcessPanning]: CameraProcessPanningEvent;
	[SemanticEvents.CameraEndPanning]: CameraEndPanningEvent;
	[SemanticEvents.CameraZoom]: CameraZoomEvent;
	// toolbox
	[SemanticEvents.ToolboxChangeTool]: ToolboxChangeToolEvent;
	[SemanticEvents.ToolboxChangeStrokeColor]: ToolboxChangeStrokeColorEvent;
	[SemanticEvents.ToolboxChangeStrokeSize]: ToolboxChangeStrokeSizeEvent;
	// board history
	[SemanticEvents.BoardHistoryMutations]: BoardHistoryMutationsEvent;
	[SemanticEvents.BoardHistoryRedoAction]: BoardHistoryRedoActionEvent;
	[SemanticEvents.BoardHistoryUndoAction]: BoardHistoryUndoActionEvent;
	// cursors
	[SemanticEvents.RemoteCursorConnect]: RemoteCursorConnectEvent;
	[SemanticEvents.RemoteCursorDisconnect]: RemoteCursorDisconnectEvent;
	[SemanticEvents.RemoteCursorMove]: RemoteCursorMoveEvent;
	[SemanticEvents.LocalCursorMove]: LocalCursorMoveEvent;
	// renderer
	[SemanticEvents.RendererRedrawBoard]: RendererRedrawBoardEvent;
	// top panel
	[SemanticEvents.TopPanelCopyLink]: TopPanelCopyLinkEvent;
	[SemanticEvents.TopPanelExportBoard]: TopPanelExportBoardEvent;
};
