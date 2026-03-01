import type { Socket as ClientSocket } from 'socket.io-client';
import type { Socket as ServerSocket } from 'socket.io';
import type { Server as SocketIOServer } from 'socket.io';
import type { BoardMutationList } from '../board/board-mutation.js';
import type { AnyRawBoardElement } from '../board-elements/index.js';
import type { XY } from '../utils/vec2.utils.js';
import type { ClientData } from '../client-data/client-data.js';

export enum ServerBoardEvents {
	Handshake = 'handshake', // Board object, Remote cursor array
	ClientConnected = 'clientConnected', // Client ID, cursor info
	ClientDisconnected = 'clientDisconnected', // Client ID
	RemoteCursorMove = 'remoteCursorMove',
	BoardMutations = 'boardMutations',
	RefreshBoard = 'refreshBoard',
	BoardNotFound = 'boardNotFound',
}

export enum ClientBoardEvents {
	Handshake = 'handshake',
	BoardMutations = 'boardMutations',
	RequestRefresh = 'requestRefresh',
	LocalCursorMove = 'localCursorMove',
}
// server->client
export interface ServerBoardEventPayloads {
	// handshake
	[ServerBoardEvents.Handshake]: (
		roomId: string,
		roomName: string,
		boardId: string,
		raw: AnyRawBoardElement[],
		foreignClientData: ClientData[],
	) => void;

	// clients
	[ServerBoardEvents.ClientConnected]: (clientData: ClientData) => void;
	[ServerBoardEvents.ClientDisconnected]: (clientId: string) => void;

	// board actions
	[ServerBoardEvents.BoardMutations]: (mutations: BoardMutationList) => void;
	[ServerBoardEvents.RefreshBoard]: (raw: AnyRawBoardElement[]) => void;
	[ServerBoardEvents.BoardNotFound]: () => void;

	// cursor
	[ServerBoardEvents.RemoteCursorMove]: (clientId: string, position: XY) => void;
}
// client->server
export interface ClientBoardEventPayloads {
	// handshake
	[ClientBoardEvents.Handshake]: (roomId: string, cursorWorldCoords: XY, accessToken?: string | undefined) => void;
	// board actions
	[ClientBoardEvents.BoardMutations]: (mutations: BoardMutationList) => void;
	[ClientBoardEvents.RequestRefresh]: () => void;
	// cursor
	[ClientBoardEvents.LocalCursorMove]: (worldCoords: XY) => void;
}

export type BoardClientSocket = ClientSocket<ServerBoardEventPayloads, ClientBoardEventPayloads>;
export type BoardServerSocket = ServerSocket<ClientBoardEventPayloads, ServerBoardEventPayloads>;
export type Server = SocketIOServer<ClientBoardEventPayloads, ServerBoardEventPayloads>;
