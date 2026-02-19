import clientRoomsApi from '../api/rooms.client-api.js';

function addBoardCard(
	template: HTMLTemplateElement,
	container: HTMLDivElement,
	boardName: string,
	boardId: string,
	pngBase64: string
) {
	const clone = template.content.cloneNode(true) as HTMLTemplateElement;
	const card = clone.querySelector('.board-card') as HTMLDivElement;

	const boardNameElement = clone.querySelector('.board-name');
	const boardThumbnailElement = clone.querySelector('.board-card-thumbnail') as HTMLDivElement;

	if (!boardNameElement || !boardThumbnailElement) throw new Error('Can\'t get either name either thumbnail element for a board card');

	boardNameElement.textContent = boardName;
	boardThumbnailElement.style.backgroundImage = `url("data:image/png;base64,${pngBase64}")`
	boardThumbnailElement.style.backgroundSize = 'cover';
	boardThumbnailElement.style.backgroundPosition = 'center';


	container.appendChild(card);
	card.addEventListener('click', (_) => {
		window.location.href = `/board?id=${boardId}`;
	});
}

async function addCards(template: HTMLTemplateElement, container: HTMLDivElement) {
	const boards = await clientRoomsApi.getRooms();
	for (const board of boards) addBoardCard(template, container, board.name, board.id, board.pngBase64);
}

const boardContainer = document.getElementById('board-card-container') as HTMLDivElement;
const boardCardTemplate = document.getElementById('board-card-template') as HTMLTemplateElement;

if (!boardContainer || !boardCardTemplate || boardContainer === null || boardCardTemplate === null)
	throw new Error(
		"Can't retrieve board container and template elements. Does these have proper ids?",
	);

addCards(boardCardTemplate, boardContainer);
