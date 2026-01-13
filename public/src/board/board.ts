import type { Socket } from 'socket.io-client';
import { distance } from '../../../shared/utils/distance.js';
import { Stroke, type Point } from '@shared/types';
import type { BoardData } from '../../../shared/types/board-data.type.js';
import type { BoardEndDrawConfiguration } from './types/';
import { ClientBoardEvents } from '@shared/socket-events/board.socket-events.js';
import type { Camera } from '../camera.js';

// TODO: maybe put these constants in some config 
const timeThreshold = 16;
const distanceThreshold = 3;
const strokeSize = 3;

export class Board {
    constructor(public socket: Socket, private camera: Camera) {
        // this.ctx = canvas.getContext('2d');
        this.resize();
    }

    // private ctx: CanvasRenderingContext2D | null = null;
    
    private strokeBuffer: Point[] = []; // for currently drawn stroke (TODO: convert it into StrokeStream board element)
    private strokes: Stroke[] = [];

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
        this.strokes = [];
        this.lastCoords = { x: 0, y: 0 }
        this.lastTime = 0;
        this.strokeBuffer = [];
    }
    
    isDrawing() {
        return this.drawing;
    }
    
    getStrokeBuffer() {
        return this.strokeBuffer;
    }
    getStrokes() {
        return this.strokes;
    }

    resize() {
        // this.canvas.width = w;
        // this.canvas.height = h;

        this.socket.emit(ClientBoardEvents.RequestRefresh);
    }

    startConstructingStroke(worldCoords: Point) {
        this.drawing = true;
        this.lastCoords = { ...worldCoords };

        this.strokeBuffer.push(worldCoords);
    }

    processConstructingStroke(worldCoords: Point) {
       // if (!this.ctx) return;

        if (!this.drawing) return;

        if (!this.checkTimeThreshold()) return;
        if (!this.checkDistanceThreshold(worldCoords)) return;

        this.strokeBuffer.push(worldCoords); // PUSH WORLD COORDS AS DATA

        this.lastCoords = { ...worldCoords };
    }

    endConstructingStroke(cfg: BoardEndDrawConfiguration = { emit: true }) {
        if (this.drawing === false) return;
        
        this.strokes.push(new Stroke(this.strokeBuffer));

        if (cfg.emit) this.socket.emit(ClientBoardEvents.Stroke, this.strokeBuffer);

        this.drawing = false;
        this.strokeBuffer = [];
    }

    appendStroke(stroke: Stroke) {
        const points = stroke.points;

        if (!points || points[0] === undefined) return;

        this.startConstructingStroke(points[0]);

        for (const point of points)
            this.processConstructingStroke(point);

        this.endConstructingStroke({ emit: false });
    }

    refresh(data?: BoardData) {
        // if (!this.ctx) return;
        if (!data) {
            this.socket.emit(ClientBoardEvents.RequestRefresh);
            return;
        }

        this.resetData();
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas

        for (const stroke of data)
            this.appendStroke(stroke);
    }
}


