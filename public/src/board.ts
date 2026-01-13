import type { Socket } from 'socket.io-client';
import { distance } from '../../shared/utils/distance.js';
import type { Point, Stroke } from '@shared/types';
import type { BoardData } from '../../shared/types/board-data.type.js';
import type { BoardEndDrawConfiguration } from './types/';
import { ClientBoardEvents } from '@shared/events/board.events.js';
import type { Camera } from './camera.js';

// TODO: maybe put these constants in some config 
const timeThreshold = 16;
const distanceThreshold = 3;
const strokeSize = 3;

export class Board {
    constructor(private canvas: HTMLCanvasElement, public socket: Socket, private camera: Camera, w: number, h: number) {
        this.ctx = canvas.getContext('2d');
        this.resize(w, h);
    }

    private ctx: CanvasRenderingContext2D | null = null;
    private points: Point[] = [];

    private lastCoords: Point = { x: 0, y: 0 };

    private lastTime = 0;

    private drawing = false;

    private checkTimeThreshold() {
        const now = Date.now();
        if (now - this.lastTime < timeThreshold) return false;
        return true;
    }
    private checkDistanceThreshold(worldCoords: Point) {
        if (distance(this.camera.worldToScreen(this.lastCoords), this.camera.worldToScreen(worldCoords)) < distanceThreshold) return false;
        return true;
    }

    private resetData() {
        this.drawing = false;
        this.lastCoords = { x: 0, y: 0 }
        this.lastTime = 0;
        this.points = [];
    }
    
    resize(w: number, h: number) {
        this.canvas.width = w;
        this.canvas.height = h;

        this.socket.emit(ClientBoardEvents.RequestRefresh);
    }

    startDraw(worldCoords: Point) {
        this.drawing = true;
        this.lastCoords = { x: worldCoords.x, y: worldCoords.y };

        this.points.push(worldCoords);
    }

    draw(worldCoords: Point) {
        if (!this.ctx) return;

        if (!this.drawing) return;

        if (!this.checkTimeThreshold()) return;
        if (!this.checkDistanceThreshold(worldCoords)) return;

        const screenCoords = this.camera.worldToScreen(worldCoords);
        const lastScreenCoords = this.camera.worldToScreen({ x: this.lastCoords.x, y: this.lastCoords.y });

        this.ctx.lineWidth = strokeSize;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = "black";

        this.ctx.beginPath(); // RENDER IN SCREEN COORDS
        this.ctx.moveTo(lastScreenCoords.x, lastScreenCoords.y);
        this.ctx.lineTo(screenCoords.x, screenCoords.y);
        this.ctx.stroke();

        this.points.push(worldCoords); // PUSH WORLD COORDS AS DATA

        this.lastCoords = { x: worldCoords.x, y: worldCoords.y };
    }

    endDraw(cfg: BoardEndDrawConfiguration = { emit: true }) {
        if (this.drawing === false) return;

        if (cfg.emit) this.socket.emit(ClientBoardEvents.Stroke, this.points);

        this.drawing = false;
        this.points = [];
    }

    appendStroke(stroke: Stroke) {
        const points = stroke.points;

        if (!points || points[0] === undefined) return;

        this.startDraw(points[0]);

        for (const point of points)
            this.draw(point);

        this.endDraw({ emit: false });
    }

    refresh(data?: BoardData) {
        if (!this.ctx) return;
        if (!data) {
            this.socket.emit(ClientBoardEvents.RequestRefresh);
            return;
        }
        
        this.resetData();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas

        for (const stroke of data)
            this.appendStroke(stroke);
    }
}


