import type { CanvasGradient, CanvasLineCap, CanvasLineJoin, CanvasPattern } from 'canvas';

export interface SharedRenderingContext {
	// Path methods
	beginPath(): void;
	closePath(): void;
	moveTo(x: number, y: number): void;
	lineTo(x: number, y: number): void;
	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
	arc(
		x: number,
		y: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterClockwise?: boolean,
	): void;
	ellipse(
		x: number,
		y: number,
		radiusX: number,
		radiusY: number,
		rotation: number,
		startAngle: number,
		endAngle: number,
		counterClockwise?: boolean,
	): void;

	// Paint methods
	stroke(): void;
	fill(): void;
	fillText(text: string, x: number, y: number, maxWidth?: number): void;

	// State
	save(): void;
	restore(): void;

	// Styles
	lineWidth: number;
	lineCap: CanvasLineCap;
	lineJoin: CanvasLineJoin;
	strokeStyle: string | CanvasGradient | CanvasPattern;
	fillStyle: string | CanvasGradient | CanvasPattern;
}
