import { io } from 'socket.io-client';
import { AppContext } from './app-context.js';
import { EventHandler } from './event-handler/event-handler.js';
import { EventBus, type SemanticEventMap } from './event-bus';
import { BoardController } from './board/board.controller.js';
import { CameraController } from './camera/camera.controller.js';
import { ToolboxUiAdapter } from './toolbox/toolbox.ui-adapter.js';
import { ToolboxController } from './toolbox/toolbox.controller.js';

export class App {
    constructor(private document: Document) {}
    
    private getCanvas(id: string): HTMLCanvasElement {
        const el = document.getElementById(id);
        if (!(el instanceof HTMLCanvasElement))
            throw new Error(`Element #${id} is not a canvas`);
        return el;
    }

    run() {
        const socket = io();
        socket.on('connect', () => {
            console.log('Connected to localhost:3000', socket.id);
        }); 

        const canvas = this.getCanvas('canvas');

        if (!canvas) throw Error('Can\'t get a canvas element!');

        const appContext = new AppContext(canvas, socket);
        const semanticEventBus = new EventBus<SemanticEventMap>();

        const eventHandler = new EventHandler(appContext, semanticEventBus); // raw events to semantic events + event consumption
        eventHandler.registerEvents(canvas, window, socket);

        const toolboxUiAdapter = new ToolboxUiAdapter(this.document, semanticEventBus);

        const boardController = new BoardController(appContext);
        const cameraController = new CameraController(appContext);
        console.log(toolboxUiAdapter);
        const toolboxController = new ToolboxController(appContext, toolboxUiAdapter);

        boardController.subscribe(semanticEventBus);
        cameraController.subscribe(semanticEventBus);
        toolboxController.subscribe(semanticEventBus);
    }
}