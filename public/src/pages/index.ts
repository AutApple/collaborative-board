import { ClientAPI } from '../api/client-api.js';


function addBoardCard(template: HTMLTemplateElement, container: HTMLDivElement, boardName: string, boardId: string) {
    const clone = template.content.cloneNode(true) as HTMLTemplateElement;
    const card = clone.querySelector('.board-card') as HTMLDivElement;
    
    const boardNameElement = clone.querySelector('.board-name');
    if (!boardNameElement) throw new Error('Can\t get a board name elemnet');
    
    boardNameElement.textContent = boardName;
    
    container.appendChild(card);
    card.addEventListener('click', (_) => {
        window.location.href = `/board?id=${boardId}`;
    });
}

async function addCards(template: HTMLTemplateElement, container: HTMLDivElement) {
    const boards = await ClientAPI.getBoards();
    for (const board of boards)
        addBoardCard(template, container, board.name, board.id);
}

const boardContainer = document.getElementById('board-card-container') as HTMLDivElement;
const boardCardTemplate = document.getElementById('board-card-template') as HTMLTemplateElement;

if (!boardContainer || !boardCardTemplate || boardContainer === null || boardCardTemplate === null) throw new Error('Can\'t retrieve board container and template elements. Does these have proper ids?');

addCards(boardCardTemplate, boardContainer);