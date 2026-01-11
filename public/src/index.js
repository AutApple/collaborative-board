
import { Board } from './board.js';
const canvas = document.getElementById('canvas');

const board = new Board(canvas, window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => { board.resize(window.innerWidth, window.innerHeight)} );

canvas.addEventListener("mousedown", (e) => { board.startDraw(e.offsetX, e.offsetY); });
canvas.addEventListener("mousemove", (e) => { board.draw(e.offsetX, e.offsetY); });
canvas.addEventListener("mouseup", () => { board.endDraw(); }); 
canvas.addEventListener("mouseleave", () => { board.endDraw(); });