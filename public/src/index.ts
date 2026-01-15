import { AppContext } from './app-context.js';
import { Board } from './board/board.js';
import { Camera } from './camera/camera.js';
import { InputEventHandler } from './input-event-handler.js';
import { NetworkEventHandler } from './network-event-handler.js';
import { NetworkManager } from './network-manager.js';
import { Renderer } from './renderer.js';
import { socket } from './socket.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

if (!canvas) throw Error('Can\'t get a canvas element!');

const appContext = new AppContext(canvas, socket);

const networkEventHandler = new NetworkEventHandler(socket, appContext);
const inputEventHandler = new InputEventHandler(appContext);

inputEventHandler.registerEvents(canvas as HTMLCanvasElement, window);
networkEventHandler.registerEvents();
