import type { AppContext } from '../app-context.js';
import {
  SemanticEvents,
  type EventBus,
  type RendererExportBoardEvent,
  type RendererRedrawBoardEvent,
  type SemanticEventMap,
} from '../event-bus/index.js';
import type { RendererUiAdapter } from './renderer.ui-adapter.js';

export class RendererController {
  constructor(
    private appContext: AppContext,
    private uiAdapter: RendererUiAdapter,
  ) {}
  public subscribe(bus: EventBus<SemanticEventMap>) {
    bus.on(SemanticEvents.RendererRedrawBoard, this.onRendererRedrawBoard.bind(this));
    bus.on(SemanticEvents.RendererExportBoard, this.onRendererExportBoard.bind(this));
  }
  onRendererRedrawBoard(e: RendererRedrawBoardEvent) {
    this.appContext.renderer.refreshBoardLayersAndRender(
      this.appContext.camera,
      e.elements,
      e.debugStats,
    );
  }
  async onRendererExportBoard(_: RendererExportBoardEvent) {
    const blob = await this.appContext.renderer.saveBoardToPNG(this.appContext.camera);
    this.uiAdapter.downloadFile(blob);
  }
}
