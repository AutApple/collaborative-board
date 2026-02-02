import type { Socket as ClientSocket } from 'socket.io-client';
import type { Socket as ServerSocket } from 'socket.io';
import type { Server as SocketIOServer } from 'socket.io';
import type { BoardMutationList } from '../board/board-mutation.js';
import type { RawBoardElement } from '../board-elements/raw/index.js';
import type { Cursor } from '../remote-cursor/types/cursor.js';
import type { XY } from '../utils/vec2.utils.js';

export enum ServerBoardEvents {
  Handshake = 'handshake', // Board object, Remote cursor array
  ClientConnected = 'clientConnected', // Client ID, cursor info
  ClientDisconnected = 'clientDisconnected', // Client ID
  RemoteCursorMove = 'remoteCursorMove',
  BoardMutations = 'boardMutations',
  RefreshBoard = 'refreshBoard',
}

export enum ClientBoardEvents {
  Handshake = 'handshake',
  BoardMutations = 'boardMutations',
  RequestRefresh = 'requestRefresh',
  LocalCursorMove = 'localCursorMove',
}

export interface ServerBoardEventPayloads {
  [ServerBoardEvents.Handshake]: (raw: RawBoardElement[], cursors: Cursor[]) => void;
  [ServerBoardEvents.ClientConnected]: (clientId: string, cursor: Cursor) => void;
  [ServerBoardEvents.ClientDisconnected]: (clientId: string) => void;
  [ServerBoardEvents.BoardMutations]: (mutations: BoardMutationList) => void;
  [ServerBoardEvents.RefreshBoard]: (raw: RawBoardElement[]) => void;
  [ServerBoardEvents.RemoteCursorMove]: (cursor: Cursor) => void;
}

export interface ClientBoardEventPayloads {
  [ClientBoardEvents.Handshake]: (cursorWorldCoords: XY) => void;
  [ClientBoardEvents.BoardMutations]: (mutations: BoardMutationList) => void;
  [ClientBoardEvents.RequestRefresh]: () => void;
  [ClientBoardEvents.LocalCursorMove]: (worldCoords: XY) => void;
}

export type BoardClientSocket = ClientSocket<ServerBoardEventPayloads, ClientBoardEventPayloads>;
export type BoardServerSocket = ServerSocket<ClientBoardEventPayloads, ServerBoardEventPayloads>;
export type Server = SocketIOServer<ClientBoardEventPayloads, ServerBoardEventPayloads>;
