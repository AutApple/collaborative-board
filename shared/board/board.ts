import type { Point } from '../types/point.type.js';
import { BaseBoardElement } from './elements/index.js'

export class Board {
    constructor() { }

    private elements: BaseBoardElement[] = [];
   
    private resetData() {
        this.elements = [];
    }

    getElements() {
        return this.elements;
    }

    getLastElement(): BaseBoardElement | undefined {
        if (this.elements.length === 0) return undefined;
        return this.elements[this.elements.length - 1];
    }

    appendElement(element: BaseBoardElement) {
        this.elements.push(element);
    }

    removeElement(elementId: string) {
        this.elements = this.elements.filter(el => el.getId !== elementId);
    }

    updateElement(elementId: string, points: Point[]) { 
        const element = this.elements.find(e => e.getId === elementId);
        if (!element) return;
        element.setPoints(points);
    }

    findClosestElementTo(worldCoords: Point): BaseBoardElement | undefined {
        let minDistance = Infinity;
        let minElement: BaseBoardElement | undefined = undefined;
        for (const element of this.elements) {
            const closestPoint = element.findClosestPointTo(worldCoords);
            const isNewMinDistance = (minDistance > closestPoint.distance);
            minDistance = isNewMinDistance ? closestPoint.distance : minDistance;
            minElement = isNewMinDistance ? element : minElement;  
        }
        return minElement;
    }


    refresh(data: BaseBoardElement[]) {
        this.resetData();
        for (const element of data)
            this.appendElement(element);
    }
}


