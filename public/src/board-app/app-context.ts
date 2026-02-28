import { Vec2, type XY } from '@shared/utils/vec2.utils.js';
import { BoardHistory } from './board-history/board-history.js';
import { Camera } from '../../../shared/camera/camera.js';
import { ClientRenderer } from './renderer/renderer.js';
import { Toolbox } from './toolbox/toolbox.js';
import { clientConfiguration } from './config/client.config.js';
import { Room } from '../../../shared/room/room.js';
import { Notyf } from 'notyf';

export class AppContext {
	public renderer: ClientRenderer;
	public camera: Camera;
	public toolbox: Toolbox;
	public boardHistory: BoardHistory;
	public room: Room;
	public notyf: Notyf;

	constructor(canvas: HTMLCanvasElement) {
		this.notyf = new Notyf({
			position: {
				x: 'center',
				y: 'top',
			},
		});

		this.room = new Room({
			isLocal: true,
		});

		this.renderer = new ClientRenderer(
			canvas,
			clientConfiguration.boardBackgroundColor,
			clientConfiguration.debugOverlay,
		);
		this.camera = new Camera(
			new Vec2(0, 0),
			1,
			clientConfiguration.minCameraScale,
			clientConfiguration.maxCameraScale,
		);
		this.toolbox = new Toolbox(
			clientConfiguration.defaultStrokeData,
			clientConfiguration.defaultTool,
		);
		this.boardHistory = new BoardHistory();
	}
}
