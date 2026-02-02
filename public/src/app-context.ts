import { Board } from '@shared/board/board.js';
import { RemoteCursorMap } from '@shared/remote-cursor/remote-cursor-map.js';
import { Vec2, type XY } from '@shared/utils/vec2.utils.js';
import { BoardHistory } from './board-history/board-history.js';
import { Camera } from './camera/camera.js';
import { Renderer } from './renderer/renderer.js';
import { Toolbox } from './toolbox/toolbox.js';

export class AppContext {
	public board: Board;
	public renderer: Renderer;
	public camera: Camera;
	public toolbox: Toolbox;
	public boardHistory: BoardHistory;
	public remoteCursorList: RemoteCursorMap = new RemoteCursorMap();
	public localCursorWorldCoords: XY;

	constructor(canvas: HTMLCanvasElement) {
		this.board = new Board();
		this.renderer = new Renderer(canvas);
		this.camera = new Camera(new Vec2(0, 0), 1);
		this.toolbox = new Toolbox(this.board);
		this.boardHistory = new BoardHistory();
		this.localCursorWorldCoords = { x: 0, y: 0 };
	}
}
