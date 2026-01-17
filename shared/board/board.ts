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

    refresh(data: BaseBoardElement[]) {
        this.resetData();
        for (const element of data)
            this.appendElement(element);
    }
}


