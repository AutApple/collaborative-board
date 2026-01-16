import { io } from 'socket.io-client';
import { AppContext } from './app-context.js';
import { InputEventHandler } from './input-event-handler.js';
import { NetworkEventHandler } from './network-event-handler.js';
export class App {
    private inputEventHandler: InputEventHandler | undefined;
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

        this.networkEventHandler = new NetworkEventHandler(socket, appContext);
        this.inputEventHandler = new InputEventHandler(appContext);

        this.inputEventHandler.registerEvents(canvas as HTMLCanvasElement, window);
        this.networkEventHandler.registerEvents();
    }
}