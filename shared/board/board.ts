import { validate, version } from 'uuid';
import { Vec2 } from '../utils/vec2.utils.js';
import { BoardMutationType, type BaseBoardMutation, type CreateBoardMutation, type RemoveBoardMutation, type UpdateBoardMutation } from './board-mutation.js';
import { BaseBoardElement } from '../board-elements/index.js';

export interface BoardDebugStats {
    overallPointsAmount:  number;
    overallElementsAmount: number; 
}

export interface ReadonlyBoard {
    getElements: () => BaseBoardElement[];
    getLastElement: () => BaseBoardElement | undefined; 
    findClosestElementTo: (worldCoords: Vec2) => BaseBoardElement | undefined;
    getDebugStats: () => BoardDebugStats;
}

export class Board implements ReadonlyBoard {
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
        element.optimizeVertices();

        
        this.elements.push(element);
    }

    removeElement(elementId: string) {
        this.elements = this.elements.filter(el => el.id !== elementId);
    }

    updateElement(elementId: string, points: Vec2[]) {
        const element = this.elements.find(e => e.id === elementId);
        if (!element) return;
        element.setVertices(points);
        element.optimizeVertices();
    }

    findClosestElementTo(worldCoords: Vec2): BaseBoardElement | undefined {
        let minDistance = Infinity;
        let minElement: BaseBoardElement | undefined = undefined;
        for (const element of this.elements) {
            const closestPoint = element.findClosestPointTo(worldCoords);
            const distance = closestPoint.distanceTo(worldCoords);
            const isNewMinDistance = (minDistance > distance);
            minDistance = isNewMinDistance ? distance : minDistance;
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
                const element = BaseBoardElement.fromRaw(createMutation.raw);
                this.appendElement(element);
                // console.log('Created element with id ', element.id);
                break;
            case BoardMutationType.Remove:
                const removeMutation = mutation as RemoveBoardMutation;
                if (!removeMutation.id) throw Error('Wrong remove board mutation signature');
                this.removeElement(removeMutation.id);
                break;
            case BoardMutationType.Update:
                const updateMutation = mutation as UpdateBoardMutation;
                if (!updateMutation.id || !updateMutation.points) throw Error('Wrong remove board mutation signature');
                this.updateElement(updateMutation.id, updateMutation.points.map(p => Vec2.fromXY(p)));
                break;
        }
    }
   
    getDebugStats(): BoardDebugStats {
        const debugStats: BoardDebugStats = {
            overallPointsAmount: 0,
            overallElementsAmount: this.elements.length
        }
        for (const element of this.elements) {
            for (const point of element.getVertices()) {
                debugStats.overallPointsAmount += 1;
            }
        }
        return debugStats;
    }
    
}


