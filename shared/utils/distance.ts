import type { Vec2 } from '../types/vec2.type.js';

export function distance(p1: Vec2, p2: Vec2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}