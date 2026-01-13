
import type { BoardData } from '../../shared/types/board-data.type.js';
import type { Stroke } from '../../shared/types/stroke.type.js';
import { Board } from './board/board.js';
import { Camera } from './camera.js';
import { InputEventManager } from './input-managers/input-event-manager.js';
import { socket } from './socket.js';
import { ServerBoardEvents } from '@shared/socket-events/board.socket-events.js';

const canvas = document.getElementById('canvas');

if (!canvas) throw Error('Can\'t get a canvas element!');

const camera = new Camera({x: 0, y: 0}, 1);
const board = new Board(canvas as HTMLCanvasElement, socket, camera, window.innerWidth, window.innerHeight);
const inputManager = new InputEventManager(socket, board, camera);

inputManager.registerEvents(canvas as HTMLCanvasElement, window);

socket.on(ServerBoardEvents.AddStroke, (stroke: Stroke) => board.appendStroke(stroke));
socket.on(ServerBoardEvents.RefreshBoard, (data: BoardData) => board.refresh(data));

