export interface XY { x: number, y: number; };
export class Vec2 implements XY {
    constructor(public x: number, public y: number) { }
    public getXY(): XY { return { x: this.x, y: this.y }; }
    public set(vec: XY) { this.x = vec.x; this.y = vec.y; }
    public add(vec: XY): Vec2 {
        return new Vec2(
            this.x + vec.x,
            this.y + vec.y,
        );
    }
    public sub(vec: XY): Vec2 {
        return new Vec2(
            this.x - vec.x,
            this.y - vec.y,
        );
    }
    public mul(vec: XY): Vec2 {
        return new Vec2(
            this.x * vec.x,
            this.y * vec.y,
        );
    }
    public div(vec: XY): Vec2 {
        return new Vec2(
            this.x / vec.x,
            this.y / vec.y,
        );
    }
    
    public divScalar(num: number): Vec2 {
        return new Vec2(
            this.x / num,
            this.y / num,
        );
    }
    public mulScalar(num: number): Vec2 {
        return new Vec2(
            this.x * num,
            this.y * num,
        );
    }
    
    public static fromXY(xy: XY) {
        return new Vec2(xy.x, xy.y);
    }
    
    public distanceTo(vec: XY): number {
        return Math.hypot(vec.x - this.x, vec.y - this.y);   
    }

    public cross(vec: XY): number {
        return (this.x * vec.y) - (this.y * vec.x);
    }

    public perpendicularDistanceTo(a: Vec2, b: Vec2): number {
        const ab = b.sub(a);
        
        const len = Math.hypot(ab.x, ab.y);
        if (len === 0) return this.distanceTo(a); // when a = b, just return distance to a to prevent dividing by zero
        
        const ap = this.sub(a);
        
        const cross = Math.abs(ab.cross(ap));
        return cross / Math.sqrt(ab.x * ab.x + ab.y * ab.y);
    }
}
