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

}
