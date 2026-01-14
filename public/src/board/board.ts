import { type Point } from '@shared/types';
import { BaseBoardElement, StrokeBoardElement } from '@shared/board-elements'

export class Board {
    constructor() { }

    private elements: BaseBoardElement[] = [];
    private constructingStrokePointer: StrokeBoardElement | null = null;

    private resetData() {
        this.constructingStrokePointer = null;
        this.elements = [];
    }
    
    isConstructingStroke() {
        return !(this.constructingStrokePointer === null);
    }

    getElements() {
        return this.elements;
    }

    getLastElement(): BaseBoardElement | undefined {
        if (this.elements.length === 0) return undefined;
        return this.elements[this.elements.length - 1];
    }
    
    startConstructingStroke(worldCoords: Point) {
        const stroke = new StrokeBoardElement(worldCoords, [{ x: 0, y: 0 }]);
        this.constructingStrokePointer = stroke;
        this.elements.push(stroke);
    }

    processConstructingStroke(worldCoords: Point) {
        if (!this.isConstructingStroke()) return;
        this.constructingStrokePointer?.addPoint(worldCoords); 
    }

    endConstructingStroke(): StrokeBoardElement | null {
        if (!this.isConstructingStroke()) return null;
        const ret = this.constructingStrokePointer;
        this.constructingStrokePointer = null;
        return ret;
    }

    appendStroke(stroke: StrokeBoardElement) {
        this.elements.push(stroke);
    }

    refresh(data: StrokeBoardElement[]) {
        this.resetData();
        for (const stroke of data)
            this.appendStroke(stroke);
    }
}


