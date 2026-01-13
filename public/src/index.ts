import { Board } from './board/board.js';
import { Camera } from './camera.js';
import { InputEventHandler } from './input-event-handlers/input-event-handler.js';
import { NetworkEventHandler } from './network-event-handler.js';
import { Renderer } from './renderer.js';
import { socket } from './socket.js';

const canvas = document.getElementById('canvas');

if (!canvas) throw Error('Can\'t get a canvas element!');

const camera = new Camera({x: 0, y: 0}, 1);

const board = new Board(socket, camera);
const renderer = new Renderer(canvas as HTMLCanvasElement);

const inputEventHandler = new InputEventHandler(socket, renderer, board, camera);
const networkEventHandler = new NetworkEventHandler(socket, board, camera, renderer);

inputEventHandler.registerEvents(canvas as HTMLCanvasElement, window);
networkEventHandler.registerEvents();
