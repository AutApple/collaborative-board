
import type { BoardData } from '../../shared/types/board-data.type.js';
import type { Stroke } from '../../shared/types/stroke.type.js';
import { Board } from './board.js';
import { socket } from './socket.js';

const canvas = document.getElementById('canvas');

if (!canvas) throw Error('Can\'t get a canvas element!');


const board = new Board(canvas as HTMLCanvasElement, socket, window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => { board.resize(window.innerWidth, window.innerHeight)} );

canvas.addEventListener("mousedown", (e) => { board.startDraw({ x: e.offsetX, y: e.offsetY }); });
canvas.addEventListener("mousemove", (e) => { board.draw({ x: e.offsetX, y: e.offsetY }); });
canvas.addEventListener("mouseup", () => { board.endDraw(); }); 
canvas.addEventListener("mouseleave", () => { board.endDraw(); });

socket.on('addStroke', (stroke: Stroke) => board.appendStroke(stroke));
socket.on('refreshBoard', (data: BoardData) => board.refresh(data));