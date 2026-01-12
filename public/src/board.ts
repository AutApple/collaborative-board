import type { Socket } from 'socket.io-client';
import { distance } from '../../shared/utils/distance.js';
import type { Point, Stroke } from '@shared/types';
import type { BoardData } from '../../shared/types/board-data.type.js';
import type { BoardEndDrawConfiguration } from './types/';

// TODO: maybe put these constants in some config 
const timeThreshold = 16;
const distanceThreshold = 3;
const strokeSize = 3;

export class Board {
    constructor(public canvas: HTMLCanvasElement, public socket: Socket, w: number, h: number) {
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
    private checkDistanceThreshold(coords: Point) {
        if (distance(this.lastCoords.x, this.lastCoords.y, coords.x, coords.y) < distanceThreshold) return false;
        return true;
    }

    resize(w: number, h: number) {
        this.canvas.width = w;
        this.canvas.height = h;

        this.socket.emit('requestRefresh');
    }

    startDraw(coords: Point) {
        this.drawing = true;

        this.lastCoords = { x: coords.x, y: coords.y };

        this.points.push(coords);
    }

    draw(coords: Point) {
        if (!this.ctx) return;

        if (!this.drawing) return;

        if (!this.checkTimeThreshold()) return;
        if (!this.checkDistanceThreshold(coords)) return;

        this.ctx.lineWidth = strokeSize;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = "black";

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastCoords.x, this.lastCoords.y);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();

        this.points.push(coords);

        this.lastCoords = { x: coords.x, y: coords.y };
    }

    endDraw(cfg: BoardEndDrawConfiguration = { emit: true }) {
        if (this.drawing === false) return;
        
        if (emit) this.socket.emit('stroke', this.points);
        

        if (cfg.emit) this.socket.emit('stroke', this.points);

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

    refresh(data: BoardData) {
        if (!this.ctx) return;

        this.drawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.lastTime = 0;
        this.points = [];
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas

        for (const stroke of data)
            this.appendStroke(stroke);
    }
}


