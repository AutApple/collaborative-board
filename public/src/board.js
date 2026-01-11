import { distance } from './utils/distance.js';


// TODO: maybe put these constants in some config 
const timeThreshold = 16;
const distanceThreshold = 3;
const strokeSize = 3;

export class Board {
    constructor (canvas, w, h) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.resize(w, h);
    }
    
    #points = [];
    
    #lastX = 0;
    #lastY = 0;
    
    #lastTime = 0;
    
    #drawing = false;

    #checkTimeThreshold() {
        const now = Date.now();
        if (now - this.#lastTime < timeThreshold) return false;
        return true;
    }
    #checkDistanceThreshold(x, y) {
        if (distance(this.#lastX, this.#lastY, x, y) < distanceThreshold) return false;
        return true;
    }

    resize(w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
    }
    
    startDraw(x, y) {
        this.#drawing = true;

        this.#lastX = x;
        this.#lastY = y;
        
        this.#points.push({ x, y });
    }

    draw(x, y) {
        if (!this.#drawing) return;
        
        if (!this.#checkTimeThreshold()) return;
        if (!this.#checkDistanceThreshold(x, y)) return;

        this.ctx.lineWidth = strokeSize;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = "black";

        this.ctx.beginPath();
        this.ctx.moveTo(this.#lastX, this.#lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        
        this.#points.push({x, y});

        this.#lastX = x;
        this.#lastY = y;
    }

    endDraw() {
        if (this.#drawing === false) return;
        
        console.log(this.#points); // TODO: send on server
        
        this.#drawing = false;
        this.#points = [];
    }
}


