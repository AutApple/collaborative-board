import { BoardEventHandler } from './handlers/board.event-handler.js';
import { CameraEventHandler } from './handlers/camera.event-handler.js';
import type { AppContext } from '../app-context.js';
import { EventBus, SemanticEvents, type SemanticEventMap } from '../event-bus';
import type { Socket } from 'socket.io-client';
import { ServerBoardEvents } from '@shared/socket-events/board.socket-events.js';
import type { RawBoardElement } from '@shared/board/elements/raw/index.js';
import type { BoardMutationList } from '@shared/board/board-mutation.js';

//TODO: split into NetworkAdapter, CanvasAdapter, WindowAdapter, DOMAdapter ... and unify in EventHandler 
export class EventHandler {
    private boardInputHandler: BoardEventHandler;
    private cameraInputHandler: CameraEventHandler;

    constructor(appContext: AppContext, private semanticEventBus: EventBus<SemanticEventMap>) {
        this.boardInputHandler = new BoardEventHandler(appContext, semanticEventBus);
        this.cameraInputHandler = new CameraEventHandler(appContext, semanticEventBus);
    };

    public registerEvents(canvas: HTMLCanvasElement, target: EventTarget, socket: Socket) {
        target.addEventListener("resize", this.handleResize.bind(this));
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        canvas.addEventListener("mouseleave", this.handleMouseLeave.bind(this));

        canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
        this.registerNetworkEvents(socket);
    }

    public handleMouseDown(e: MouseEvent): void {
        e.preventDefault();
        if (this.boardInputHandler.handleMouseDown(e)) return;
        if (this.cameraInputHandler.handleMouseDown(e)) return;
    }

    public handleMouseMove(e: MouseEvent): void {
        if (this.boardInputHandler.handleMouseMove(e)) return;
        if (this.cameraInputHandler.handleMouseMove(e)) return;
    }

    public handleMouseUp(): void {
        if (this.boardInputHandler.handleMouseUp()) return;
        if (this.cameraInputHandler.handleMouseUp()) return;
    }

    public handleMouseLeave(): void {
        if (this.boardInputHandler.handleMouseLeave()) return;
    }

    public handleMouseWheel(e: WheelEvent): void {
        e.preventDefault();
        if (this.cameraInputHandler.handleMouseWheel(e)) return;
    }

    public handleResize(): void {
        if (this.boardInputHandler.handleResize()) return;
    }

    public registerNetworkEvents(socket: Socket) {
        // socket.on(ServerBoardEvents.AddElement, (raw: RawBoardElement) => this.semanticEventBus.emit(SemanticEvents.BoardElementAdd, { rawElementData: raw }));
        socket.on(ServerBoardEvents.RefreshBoard, (raw: RawBoardElement[]) => this.semanticEventBus.emit(SemanticEvents.BoardRefresh, { rawData: raw }));
        socket.on(ServerBoardEvents.BoardMutations, (mutations: BoardMutationList) => this.semanticEventBus.emit(SemanticEvents.BoardMutations, { mutations }));
    }

}