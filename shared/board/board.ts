import { validate, version } from 'uuid';
import type { Point } from '../types/point.type.js';
import { BoardMutationType, type BaseBoardMutation, type CreateBoardMutation, type RemoveBoardMutation, type UpdateBoardMutation } from './board-mutation.js';
import { BaseBoardElement } from './elements/index.js'
import { rawElementToInstance } from './elements/utils/raw-element-to-instance.js';

export class Board {
    constructor() { }

    private elements: BaseBoardElement[] = [];
   
    private resetData() {
        this.elements = [];
    }
    
    private validateId(id: string) {
        return (validate(id) && version(id) === 4);
    }

    getElements() {
        return this.elements;
    }

    getLastElement(): BaseBoardElement | undefined {
        if (this.elements.length === 0) return undefined;
        return this.elements[this.elements.length - 1];
    }

    appendElement(element: BaseBoardElement) {
        if (!this.validateId(element.id)) return; // Check if element's id is valid
        this.elements.push(element);
    }

    removeElement(elementId: string) {
        this.elements = this.elements.filter(el => el.id !== elementId);
    }

    updateElement(elementId: string, points: Point[]) { 
        const element = this.elements.find(e => e.id === elementId);
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

    applyMutation(mutation: BaseBoardMutation) {
        switch (mutation.type) {
            case BoardMutationType.Create:
                const createMutation = mutation as CreateBoardMutation;
                if (!createMutation.raw) throw Error('Wrong create board mutation signature'); // TODO: generic centralized messages
                const element = rawElementToInstance(createMutation.raw);
                this.appendElement(element);
                console.log('Created element with id ', element.id);
                break;
            case BoardMutationType.Remove:
                const removeMutation = mutation as RemoveBoardMutation;
                if (!removeMutation.id) throw Error('Wrong remove board mutation signature');
                this.removeElement(removeMutation.id);
                break;
            case BoardMutationType.Update:
                const updateMutation = mutation as UpdateBoardMutation;
                if (!updateMutation.id || !updateMutation.points) throw Error('Wrong remove board mutation signature');
                this.updateElement(updateMutation.id, updateMutation.points);
                break;
        }
    }
}


