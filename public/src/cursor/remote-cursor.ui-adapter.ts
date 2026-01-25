import type { XY } from '../../../shared/types/vec2.type.js';

export class RemoteCursorUIAdapter {
    private cursorContainer: HTMLDivElement;
    private childrenMap: Map<string, HTMLDivElement> = new Map();

    constructor(private document: Document, cursorContainerListId: string = 'cursors-layer', private cursorClassName: string = 'remote-cursor') {
        this.cursorContainer = document.getElementById(cursorContainerListId) as HTMLDivElement;

        if (!this.cursorContainer) throw new Error('Can\'t find a cursor container element. Does id spelled correctly?');
    }

    addCursor(clientId: string, screenCoords: XY): void {
        const cursorElement = this.document.createElement('div') as HTMLDivElement;
        cursorElement.classList.add(this.cursorClassName);
 
        cursorElement.style.transform = `translate(${screenCoords.x}px, ${screenCoords.y}px)`;

        this.childrenMap.set(clientId, cursorElement);
        this.cursorContainer.appendChild(cursorElement);
    }

    removeCursor(clientId: string) {
        const cursorElement = this.childrenMap.get(clientId);
        if (!cursorElement) return;
        this.cursorContainer.removeChild(cursorElement);
        this.childrenMap.delete(clientId);
    }

    changeCursorPosition(clientId: string, screenCoords: XY) {
        const cursorElement = this.childrenMap.get(clientId);
        if (!cursorElement) return;
        cursorElement.style.transform = `translate(${screenCoords.x}px, ${screenCoords.y}px)`;
    }


}