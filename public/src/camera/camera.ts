import type { Point } from '@shared/types';

export class Camera {
    private initialPos: Point = {x: 0, y: 0};
    private initialScale: number = 1;
    
    private panning = false;

    private startMouse: Point = { x: 0, y: 0 }; // where the drag started
    private startPos: Point = { x: 0, y: 0 };   // camera pos at drag start
    
    constructor (private pos: Point = { x: 0, y:0 }, private scale = 1) {
        this.initialPos = {... pos};
        this.initialScale = scale;
    }
    
    public screenToWorld (p: Point): Point {
        return {
            x: (p.x - this.pos.x) / this.scale,
            y: (p.y - this.pos.y) / this.scale
        };
    }

    public worldToScreen(p: Point): Point {
        return {
            x: (p.x * this.scale) + this.pos.x,
            y: (p.y * this.scale) + this.pos.y 
        };
    }
    
    public reset() {
        this.pos = {... this.initialPos};
        this.scale = this.initialScale;
    } 

    public zoom(p: Point, factor: number) {
        const mouse = this.screenToWorld(p);
        const zoomFactor = factor < 0 ? 1.1 : 0.9;

        this.scale *= zoomFactor;

        this.pos.x = p.x - mouse.x * this.scale;
        this.pos.y = p.y - mouse.y * this.scale;
    }
    
    public isPanning(): boolean {
        return this.panning;
    }

    public startMove(mouse: Point) {
        this.panning = true;
        this.startMouse = { ...mouse }; // screen-space
        this.startPos = { ...this.pos }; // camera pos at start
    }

    public move(mouse: Point) {
        if (!this.panning) return;

        const dx = mouse.x - this.startMouse.x;
        const dy = mouse.y - this.startMouse.y;

        this.pos.x = this.startPos.x + dx;
        this.pos.y = this.startPos.y + dy;
    }

    public endMove() {
        this.panning = false;
    }
}