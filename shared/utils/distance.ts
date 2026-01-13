import type { Point } from '../types/point.type.js';

export function distance(p1: Point, p2: Point) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}