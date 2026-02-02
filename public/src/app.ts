import type { BoardClientSocket } from '@shared/socket-events/board.socket-events.js';
import { io } from 'socket.io-client';
import { AppContext } from './app-context.js';
import { BoardHistoryController } from './board-history/board-history.controller.js';
import { BoardController } from './board/board.controller.js';
import { CameraController } from './camera/camera.controller.js';
import { EventBus, type SemanticEventMap } from './event-bus';
import { EventHandler } from './event-handler/event-handler.js';
import { NetworkController } from './network/network.controller.js';
import { NetworkService } from './network/network.service.js';
import { CursorController } from './cursor/cursor.controller.js';
import { RemoteCursorUIAdapter } from './cursor/remote-cursor.ui-adapter.js';
import { ToolboxController } from './toolbox/toolbox.controller.js';
import { ToolboxUiAdapter } from './toolbox/toolbox.ui-adapter.js';
import { NetworkUiAdapter } from './network/network.ui-adapter.js';
import { RendererController } from './renderer/renderer.controller.js';
import { RendererUiAdapter } from './renderer/renderer.ui-adapter.js';

export class BoardClient {
  constructor(private document: Document) {}

  private getCanvas(id: string): HTMLCanvasElement {
    const el = document.getElementById(id);
    if (!(el instanceof HTMLCanvasElement)) throw new Error(`Element #${id} is not a canvas`);
    return el;
  }
  private init(socket: BoardClientSocket) {
    const canvas = this.getCanvas('canvas');

    if (!canvas) throw Error("Can't get a canvas element!");

    const appContext = new AppContext(canvas);
    const semanticEventBus = new EventBus<SemanticEventMap>();

    const eventHandler = new EventHandler(appContext, semanticEventBus); // raw events to semantic events + event consumption
    eventHandler.registerEvents(canvas, window);

    const toolboxUiAdapter = new ToolboxUiAdapter(this.document, semanticEventBus);
    const remoteCursorUiAdapter = new RemoteCursorUIAdapter(this.document);
    const rendererUiAdapter = new RendererUiAdapter(this.document, semanticEventBus);
    const networkUiAdapter = new NetworkUiAdapter(this.document);
    networkUiAdapter.hideDisconnectOverlay();

    const networkService = new NetworkService(socket);
    const networkController = new NetworkController(
      appContext,
      networkUiAdapter,
      semanticEventBus,
      networkService,
    );

    networkController.bind(socket);

    const boardController = new BoardController(appContext, networkService);
    const cameraController = new CameraController(appContext);
    const toolboxController = new ToolboxController(appContext, toolboxUiAdapter, networkService);
    const boardHistoryController = new BoardHistoryController(appContext);
    const cursorController = new CursorController(
      appContext,
      remoteCursorUiAdapter,
      networkService,
    );
    const rendererController = new RendererController(appContext, rendererUiAdapter);

    boardController.subscribe(semanticEventBus);
    cameraController.subscribe(semanticEventBus);
    toolboxController.subscribe(semanticEventBus);
    boardHistoryController.subscribe(semanticEventBus);
    cursorController.subscribe(semanticEventBus);
    rendererController.subscribe(semanticEventBus);
  }
  run() {
    const socket: BoardClientSocket = io();
    socket.on('connect', () => {
      console.log('Connected to localhost:3000', socket.id);
      this.init(socket);
    });
  }
}
