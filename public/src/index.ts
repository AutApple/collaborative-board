
import type { BoardData } from '../../shared/types/board-data.type.js';
import type { Stroke } from '../../shared/types/stroke.type.js';
import { Board } from './board/board.js';
import { Camera } from './camera.js';
import { InputEventHandler } from './input-event-handlers/input-event-handler.js';
import { Renderer } from './renderer.js';
import { socket } from './socket.js';
import { ServerBoardEvents } from '@shared/socket-events/board.socket-events.js';

const canvas = document.getElementById('canvas');

if (!canvas) throw Error('Can\'t get a canvas element!');

const camera = new Camera({x: 0, y: 0}, 1);

const board = new Board(socket, camera);
const renderer = new Renderer(canvas as HTMLCanvasElement);

const inputManager = new InputEventHandler(socket, renderer, board, camera);

inputManager.registerEvents(canvas as HTMLCanvasElement, window);

socket.on(ServerBoardEvents.AddStroke, (stroke: Stroke) => {board.appendStroke(stroke); renderer.renderBoard(board, camera);});
socket.on(ServerBoardEvents.RefreshBoard, (data: BoardData) => {board.refresh(data); renderer.renderBoard(board, camera); });

