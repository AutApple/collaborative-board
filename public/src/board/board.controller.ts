import type { AppContext } from '../app-context.js';
import { rawElementToInstance } from '@shared/board/elements/utils/raw-element-to-instance.js';
import { SemanticEvents, type BoardProcessDrawingEvent, type BoardRefreshEvent, type BoardResizeEvent, type BoardStartDrawingEvent } from '../event-bus/events/index.js';
import type { BoardMutationsEvent, EventBus, SemanticEventMap } from '../event-bus';
import { applyBoardMutation } from '@shared/board/board-mutation.js';

export class BoardController {
    constructor (private appContext: AppContext) {}
    
    public subscribe(bus: EventBus<SemanticEventMap>) { 
        bus.on(SemanticEvents.BoardStartDrawing, this.onBoardStartDrawing.bind(this));
        bus.on(SemanticEvents.BoardProcessDrawing, this.onBoardMouseMove.bind(this));
        bus.on(SemanticEvents.BoardEndDrawing, this.onBoardEndDrawing.bind(this));
        bus.on(SemanticEvents.BoardRefresh, this.onBoardRefresh.bind(this));
        bus.on(SemanticEvents.BoardResize, this.onBoardResize.bind(this));
        bus.on(SemanticEvents.BoardMutations, this.onBoardMutations.bind(this));
    }

    private onBoardStartDrawing (e: BoardStartDrawingEvent) {
        this.appContext.toolbox.startConstructing(this.appContext.camera.screenToWorld(e.screenCoords));
    }

    private onBoardEndDrawing () {
        const mutations = this.appContext.toolbox.endConstructing();
        if (mutations !== null)
            this.appContext.networkManager.sendBoardMutationList(mutations);
        // this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera); // being rendered on board mutations now
    }

    private onBoardMouseMove(e: BoardProcessDrawingEvent) {
        this.appContext.toolbox.stepConstructing(this.appContext.camera.screenToWorld(e.screenCoords));
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);
    }
    
    private onBoardMutations(e: BoardMutationsEvent) {
        // console.log(`Got mutations!: ${e.mutations}`);
        for (const mutation of e.mutations)
            applyBoardMutation(mutation, this.appContext.board);
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);
    }

    private onBoardRefresh(e: BoardRefreshEvent) {
        const data = e.rawData.map((raw) => rawElementToInstance(raw, raw.id));
        this.appContext.board.refresh(data);
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);
    }

    private onBoardResize(e: BoardResizeEvent) {
        this.appContext.renderer.resizeCanvas(e.w, e.h);
        this.appContext.networkManager.requestBoardRefresh();
    }  
}