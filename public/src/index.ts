import { Board } from './board/board.js';
import { Camera } from './camera/camera.js';
import { InputEventHandler } from './input-event-handler.js';
import { NetworkEventHandler } from './network-event-handler.js';
import { NetworkManager } from './network-manager.js';
import { Renderer } from './renderer.js';
import { socket } from './socket.js';

const canvas = document.getElementById('canvas');

if (!canvas) throw Error('Can\'t get a canvas element!');

const camera = new Camera({x: 0, y: 0}, 1);

const board = new Board();
const renderer = new Renderer(canvas as HTMLCanvasElement);
const networkManager = new NetworkManager(socket);

const networkEventHandler = new NetworkEventHandler(socket, board, camera, renderer);
const inputEventHandler = new InputEventHandler(networkManager, renderer, board, camera);

inputEventHandler.registerEvents(canvas as HTMLCanvasElement, window);
networkEventHandler.registerEvents();
