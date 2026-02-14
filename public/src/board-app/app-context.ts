import { Board } from '@shared/board/board.js';
import { RemoteCursorMap } from '@shared/remote-cursor/remote-cursor-map.js';
import { Vec2, type XY } from '@shared/utils/vec2.utils.js';
import { BoardHistory } from './board-history/board-history.js';
import { Camera } from '../../../shared/camera/camera.js';
import { ClientRenderer } from './renderer/renderer.js';
import { Toolbox } from './toolbox/toolbox.js';
import { clientConfiguration } from './config/client.config.js';

export class AppContext {
	public board: Board;
	public renderer: ClientRenderer;
	public camera: Camera;
	public toolbox: Toolbox;
	public boardHistory: BoardHistory;
	public remoteCursorList: RemoteCursorMap = new RemoteCursorMap();
	public localCursorWorldCoords: XY;

	constructor(canvas: HTMLCanvasElement) {
		this.board = new Board();
		this.renderer = new ClientRenderer(canvas, clientConfiguration.boardBackgroundColor, clientConfiguration.debugOverlay);
		this.camera = new Camera(new Vec2(0, 0), 1, clientConfiguration.minCameraScale, clientConfiguration.maxCameraScale);
		this.toolbox = new Toolbox(this.board, clientConfiguration.defaultStrokeData, clientConfiguration.defaultTool);
		this.boardHistory = new BoardHistory();
		this.localCursorWorldCoords = { x: 0, y: 0 };
	}
}
