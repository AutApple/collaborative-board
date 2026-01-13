
import type { BoardData } from '../../shared/types/board-data.type.js';
import type { Stroke } from '../../shared/types/stroke.type.js';
import { Board } from './board.js';
import { Camera } from './camera.js';
import { socket } from './socket.js';
import { ServerBoardEvents } from '@shared/events/board.events.js';

const canvas = document.getElementById('canvas');

if (!canvas) throw Error('Can\'t get a canvas element!');

const camera = new Camera({x: 0, y: 0}, 1);
const board = new Board(canvas as HTMLCanvasElement, socket, camera, window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => { board.resize(window.innerWidth, window.innerHeight)} );

canvas.addEventListener("mousedown", (e) => { board.startDraw(camera.screenToWorld({ x: e.offsetX, y: e.offsetY })); });
canvas.addEventListener("mousemove", (e) => { board.draw(camera.screenToWorld({ x: e.offsetX, y: e.offsetY })); });
canvas.addEventListener("mouseup", () => { board.endDraw(); }); 
canvas.addEventListener("mouseleave", () => { board.endDraw(); });

canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    camera.zoom({x: e.offsetX, y: e.offsetY }, e.deltaY);
    board.refresh();
});

socket.on(ServerBoardEvents.AddStroke, (stroke: Stroke) => board.appendStroke(stroke));
socket.on(ServerBoardEvents.RefreshBoard, (data: BoardData) => board.refresh(data));

