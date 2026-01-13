import type { Socket } from 'socket.io-client';
import { distance } from '../../../shared/utils/distance.js';
import { Stroke, type Point } from '@shared/types';
import type { BoardData } from '../../../shared/types/board-data.type.js';
import type { Camera } from '../camera.js';

// TODO: maybe put these constants in some config 
const timeThreshold = 16;
const distanceThreshold = 3;
const strokeSize = 3;

export class Board {
    constructor(private camera: Camera) { }

    // private ctx: CanvasRenderingContext2D | null = null;
    
    private strokeBuffer: Point[] = []; // for currently drawn stroke (TODO: convert it into StrokeStream board element)
    private strokes: Stroke[] = [];

    private lastCoords: Point = { x: 0, y: 0 };

    private lastTime = 0;

    private constructingStroke = false;

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
        this.constructingStroke = false;
        this.strokes = [];
        this.lastCoords = { x: 0, y: 0 }
        this.lastTime = 0;
        this.strokeBuffer = [];
    }
    
    isConstructingStroke() {
        return this.constructingStroke;
    }
    
    getStrokeBuffer() {
        return this.strokeBuffer;
    }
    getStrokes() {
        return this.strokes;
    }

    getLastStroke(): Stroke | undefined {
        if (this.strokes.length === 0) return undefined;
        return this.strokes[this.strokes.length - 1];
    }
    
   
    startConstructingStroke(worldCoords: Point) {
        this.constructingStroke = true;
        this.lastCoords = { ...worldCoords };

        this.strokeBuffer.push(worldCoords);
    }

    processConstructingStroke(worldCoords: Point) {
        if (!this.constructingStroke) return;

        if (!this.checkTimeThreshold()) return;
        if (!this.checkDistanceThreshold(worldCoords)) return;

        this.strokeBuffer.push(worldCoords); 

        this.lastCoords = { ...worldCoords };
    }

    endConstructingStroke() {
        if (this.constructingStroke === false) return;
        
        this.strokes.push(new Stroke(this.strokeBuffer));

        this.constructingStroke = false;
        this.strokeBuffer = [];
    }

    appendStroke(stroke: Stroke) {
        const points = stroke.points;

        if (!points || points[0] === undefined) return;

        this.startConstructingStroke(points[0]);

        for (const point of points)
            this.processConstructingStroke(point);

        this.endConstructingStroke();
    }

    refresh(data: BoardData) {
        this.resetData();
        for (const stroke of data)
            this.appendStroke(stroke);
    }
}


