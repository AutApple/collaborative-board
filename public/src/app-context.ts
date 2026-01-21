import type { Socket } from 'socket.io-client';
import { Board } from '@shared/board/board.js';
import { Renderer } from './renderer.js';
import { Camera } from './camera/camera.js';
import { NetworkManager } from './network-manager.js';
import { Toolbox } from './toolbox/toolbox.js';
import { Vec2 } from '@shared/types/vec2.type.js';

export class AppContext {
    public board: Board;
    public renderer: Renderer;
    public camera: Camera;
    public networkManager: NetworkManager;
    public toolbox: Toolbox;

    constructor(canvas: HTMLCanvasElement, socket: Socket) {
        this.board = new Board();
        this.renderer = new Renderer(canvas);
        this.camera = new Camera(new Vec2(0, 0), 1);
        this.networkManager = new NetworkManager(socket);
        this.toolbox = new Toolbox(this.board);
    }
}