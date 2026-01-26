import type { AppContext } from '../app-context.js';
import { rawElementToInstance } from '@shared/board/elements/utils/raw-element-to-instance.js';
import { SemanticEvents, type BoardProcessDrawingEvent, type BoardRefreshEvent, type BoardResizeEvent, type BoardStartDrawingEvent } from '../event-bus/events/index.js';
import type { BoardHistoryMutationsEvent, BoardMutationsEvent, EventBus, SemanticEventMap } from '../event-bus';
import { optimizeMutations } from '@shared/board/board-mutation.js';
import type { NetworkService } from '../network/network.service.js';
import { RenderLayerType } from '../renderer/types/render-layer.type.js';

export class BoardController {
    constructor(private appContext: AppContext, private networkService: NetworkService) { }

    public subscribe(bus: EventBus<SemanticEventMap>) {
        bus.on(SemanticEvents.BoardStartDrawing, (e) => { this.onBoardStartDrawing(e, bus) });
        bus.on(SemanticEvents.BoardProcessDrawing, (e) => { this.onBoardMouseMove(e, bus) });
        bus.on(SemanticEvents.BoardEndDrawing, () => { this.onBoardEndDrawing(bus) });
        bus.on(SemanticEvents.BoardRefresh, this.onBoardRefresh.bind(this));
        bus.on(SemanticEvents.BoardResize, this.onBoardResize.bind(this));
        bus.on(SemanticEvents.BoardMutations, this.onBoardMutations.bind(this));
        bus.on(SemanticEvents.BoardHistoryMutations, this.onBoardHistoryMutaitons.bind(this));
    }


    private onBoardStartDrawing(e: BoardStartDrawingEvent, bus: EventBus<SemanticEventMap>) {
        const toolResult = this.appContext.toolbox.startConstructing(this.appContext.camera.screenToWorld(e.screenCoords));
        if (toolResult !== null)
            toolResult.apply(this.appContext, this.networkService, bus);
    }

    private onBoardEndDrawing(bus: EventBus<SemanticEventMap>) {
        const toolResult = this.appContext.toolbox.endConstructing();
        if (toolResult !== null)
            toolResult.apply(this.appContext, this.networkService, bus);
    }

    private onBoardMouseMove(e: BoardProcessDrawingEvent, bus: EventBus<SemanticEventMap>) {
        // TODO: stroke streaming 
        const toolResult = this.appContext.toolbox.stepConstructing(this.appContext.camera.screenToWorld(e.screenCoords));
        if (toolResult !== null)
            toolResult.apply(this.appContext, this.networkService, bus);        
    }

    private onBoardMutations(e: BoardMutationsEvent) {
        // console.log(`Got mutations!: ${e.mutations}`);
        for (const mutation of e.mutations)
            this.appContext.board.applyMutation(mutation);

        this.appContext.renderer.setLayerData(RenderLayerType.DebugStats, this.appContext.board.getDebugStats());
        this.appContext.renderer.setLayerDataAndRender(this.appContext.camera, RenderLayerType.Elements, this.appContext.board.getElements());
    }

    private onBoardRefresh(e: BoardRefreshEvent) {
        const data = e.rawData.map((raw) => rawElementToInstance(raw));
        this.appContext.board.refresh(data);

        this.appContext.renderer.setLayerData(RenderLayerType.DebugStats, this.appContext.board.getDebugStats());
        this.appContext.renderer.setLayerDataAndRender(this.appContext.camera, RenderLayerType.Elements, this.appContext.board.getElements());

    }

    private onBoardResize(e: BoardResizeEvent) {
        this.appContext.renderer.resizeCanvas(e.w, e.h);
        this.appContext.renderer.renderAll(this.appContext.camera);
    }

    private onBoardHistoryMutaitons(e: BoardHistoryMutationsEvent) {
        const { mutations } = e;
        for (const mutation of mutations)
            this.appContext.board.applyMutation(mutation);
        this.networkService.sendBoardMutationList(mutations);
        this.appContext.renderer.setLayerData(RenderLayerType.DebugStats, this.appContext.board.getDebugStats());
        this.appContext.renderer.setLayerDataAndRender(this.appContext.camera, RenderLayerType.Elements, this.appContext.board.getElements());
    }
}