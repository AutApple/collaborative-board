import { io } from 'socket.io-client';
import { AppContext } from './app-context.js';
import { EventHandler } from './event-handler/event-handler.js';
import { NetworkEventHandler } from './network-event-handler.js';
import { EventBus, type SemanticEventMap } from './event-bus';
import { BoardController } from './board/board.controller.js';
import { CameraController } from './camera/camera.controller.js';

export class App {
    private inputEventHandler: EventHandler | undefined;
    private networkEventHandler: NetworkEventHandler | undefined;
    
    
    constructor(private document: Document) {}

    run() {
        const socket = io();
        socket.on('connect', () => {
            console.log('Connected to localhost:3000', socket.id);
        }); 

        const canvas = this.document.getElementById('canvas') as HTMLCanvasElement;

        if (!canvas) throw Error('Can\'t get a canvas element!');

        const appContext = new AppContext(canvas, socket);
        const semanticEventBus = new EventBus<SemanticEventMap>();

        this.networkEventHandler = new NetworkEventHandler(socket, appContext);
        this.inputEventHandler = new EventHandler(appContext, semanticEventBus); // raw events to semantic events 

        this.inputEventHandler.registerEvents(canvas as HTMLCanvasElement, window);
        this.networkEventHandler.registerEvents();

        const boardController = new BoardController(appContext);
        const cameraController = new CameraController(appContext);

        boardController.subscribe(semanticEventBus);
        cameraController.subscribe(semanticEventBus);

    }
}