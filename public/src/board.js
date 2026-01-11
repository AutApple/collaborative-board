import { distance } from './utils/distance.js';


// TODO: maybe put these constants in some config 
const timeThreshold = 16;
const distanceThreshold = 3;
const strokeSize = 3;

export class Board {
    constructor (canvas, socket, w, h) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.socket = socket;

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

    endDraw(emit = true) {
        if (this.#drawing === false) return;
        
        if (emit) this.socket.emit('stroke', this.#points);
        
        this.#drawing = false;
        this.#points = [];
    }

    appendStroke(stroke) {
        const points = stroke.points; 
        this.startDraw(points[0].x, points[0].y);
        for (const point of points) {
            this.draw(point.x, point.y);
        }
        this.endDraw(false);
    }

    refresh(data) {
        this.#drawing = false;
        this.#lastX = 0;
        this.#lastY = 0;
        this.#lastTime = 0;
        this.#points = [];
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas

        for (const stroke of data)
            this.appendStroke(stroke);
    }
}


