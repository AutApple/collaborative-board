
import { Board } from './board.js';
import { socket } from './socket.js';

const canvas = document.getElementById('canvas');

const board = new Board(canvas, socket, window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => { board.resize(window.innerWidth, window.innerHeight)} );

canvas.addEventListener("mousedown", (e) => { board.startDraw(e.offsetX, e.offsetY); });
canvas.addEventListener("mousemove", (e) => { board.draw(e.offsetX, e.offsetY); });
canvas.addEventListener("mouseup", () => { board.endDraw(); }); 
canvas.addEventListener("mouseleave", () => { board.endDraw(); });

socket.on('addStroke', (stroke) => board.appendStroke(stroke));
socket.on('refreshBoard', (data) => board.refresh(data));