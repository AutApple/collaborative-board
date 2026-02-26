import authApi from '../api/auth/auth.client-api.js';
import clientRoomsApi from '../api/rooms/rooms.client-api.js';
import usersApi from '../api/users/users.client-api.js';

function addBoardCard(
	template: HTMLTemplateElement,
	container: HTMLDivElement,
	boardName: string,
	boardId: string,
	pngBase64: string,
) {
	const clone = template.content.cloneNode(true) as HTMLTemplateElement;
	const card = clone.querySelector('.board-card') as HTMLDivElement;

	const boardNameElement = clone.querySelector('.board-name');
	const boardThumbnailElement = clone.querySelector('.board-card-thumbnail') as HTMLDivElement;

	if (!boardNameElement || !boardThumbnailElement)
		throw new Error("Can't get either name either thumbnail element for a board card");

	boardNameElement.textContent = boardName;
	boardThumbnailElement.style.backgroundImage = `url("data:image/png;base64,${pngBase64}")`;
	boardThumbnailElement.style.backgroundSize = 'cover';
	boardThumbnailElement.style.backgroundPosition = 'center';

	container.appendChild(card);
	card.addEventListener('click', (_) => {
		window.location.href = `/board?id=${boardId}`;
	});
}

async function addCards(template: HTMLTemplateElement, container: HTMLDivElement) {
	const boards = await clientRoomsApi.getPublicRooms();
	for (const board of boards)
		addBoardCard(template, container, board.name, board.id, board.pngBase64);
}

const boardContainer = document.getElementById('board-card-container') as HTMLDivElement;
const boardCardTemplate = document.getElementById('board-card-template') as HTMLTemplateElement;

if (!boardContainer || !boardCardTemplate || boardContainer === null || boardCardTemplate === null)
	throw new Error(
		"Can't retrieve board container and template elements. Does these have proper ids?",
	);

addCards(boardCardTemplate, boardContainer);

async function checkAuth(signUpTemplate: HTMLTemplateElement, userInfoTemplate: HTMLTemplateElement, container: HTMLDivElement) {
	const accessToken = await authApi.getAccessToken();
	
	if (!accessToken) {
		const clone = signUpTemplate.content.cloneNode(true)  as HTMLTemplateElement;
		container.appendChild(clone);
		return;
	}
	const clone = userInfoTemplate.content.cloneNode(true)  as HTMLTemplateElement;
	container.appendChild(clone);

	const user = await usersApi.getMe(accessToken);
	const userInfoWelcome = document.getElementById('user-info-text');
	if (!userInfoWelcome) throw new Error('can\'t find user info element');
	else userInfoWelcome.innerText = `Welcome, ${user?.username}`;
	
}


const signUpTemplate = document.getElementById('sign-up-template') as HTMLTemplateElement;
const userInfoTemplate = document.getElementById('user-info-template') as HTMLTemplateElement;
const userContainer = document.getElementById('user-container') as HTMLDivElement;

checkAuth(signUpTemplate, userInfoTemplate, userContainer);