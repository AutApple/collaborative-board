import { Vec2 } from '@shared/types';

export class Camera {
    private initialPos: Vec2 = new Vec2(0, 0);
    private initialScale: number = 1;

    private panning = false;

    private startMouse: Vec2 = new Vec2(0, 0); // where the drag started
    private startPos: Vec2 = new Vec2(0, 0);   // camera pos at drag start

    constructor(private pos: Vec2 = new Vec2(0, 0), private scale = 1) {
        this.initialPos.set(pos.getXY());
        this.initialScale = scale;
    }

    public screenToWorld(p: Vec2): Vec2 {
        return p.sub(this.pos).divScalar(this.scale);
    }

    public worldToScreen(p: Vec2): Vec2 {
        return p.mulScalar(this.scale).add(this.pos);
    }

    public reset() {
        this.pos.set(this.initialPos);
        this.scale = this.initialScale;
    }

    public zoom(p: Vec2, factor: number) {
        const mouse = this.screenToWorld(p);
        const zoomFactor = factor < 0 ? 1.1 : 0.9;

        this.scale *= zoomFactor;

        this.pos = Vec2.fromXY(p.sub(mouse.mulScalar(this.scale)));
    }

    public isPanning(): boolean {
        return this.panning;
    }

    public startMove(mouse: Vec2) {
        this.panning = true;
        this.startMouse.set(mouse); // screen-space
        this.startPos.set(this.pos); // camera pos at start
    }

    public move(mouse: Vec2) {
        if (!this.panning) return;

        const delta = mouse.sub(this.startMouse);
        this.pos.set(this.startPos.add(delta));
    }

    public endMove() {
        this.panning = false;
    }
}