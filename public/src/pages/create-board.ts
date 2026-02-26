import authApi from '../api/auth/auth.client-api.js';
import clientRoomsApi from '../api/rooms/rooms.client-api.js';

const createButton = document.getElementById('board-create-input');
const createInput = document.getElementById('board-name-input') as HTMLInputElement;

const createInputErrorBox = document.getElementById('board-name-input-errors');
const createInputErrorBoxText = document.getElementById('board-name-input-error-content');

const publicVisibilityButton = document.getElementById('board-public-input') as HTMLInputElement;
const privateVisibilityButton = document.getElementById('board-private-input') as HTMLInputElement;

const boardVisibilityWarning = document.getElementById('board-visibility-warning');

async function visibilityButtonsInit(): Promise<void> {
	const accessToken = await authApi.getAccessToken();
	if (!accessToken) return;

	publicVisibilityButton.disabled = false;
	privateVisibilityButton.disabled = false;

	boardVisibilityWarning!.textContent = '';
}
console.log(publicVisibilityButton, privateVisibilityButton, boardVisibilityWarning);
if (!publicVisibilityButton || !privateVisibilityButton || !boardVisibilityWarning)
	throw new Error('Undefined element');

visibilityButtonsInit();

if (!createButton || !createInput || !createInputErrorBox || !createInputErrorBoxText)
	throw new Error('Undefined element');

createButton.addEventListener('click', async () => {
	const boardName = createInput.value;

	if (!boardName || boardName.trim() === '') {
		createInputErrorBox.classList.remove('invisible');
		createInputErrorBoxText.textContent = "Board name can't be empty!";
		return;
	}

	createInputErrorBox.classList.add('invisible');
	try {
		const accessToken = await authApi.getAccessToken();
		const newBoard = await clientRoomsApi.addRoom(
			boardName,
			publicVisibilityButton.checked,
			accessToken ?? undefined,
		);
		window.location.href = `/board?id=${newBoard.id}`;
	} catch (err: any) {
		createInputErrorBox.classList.remove('invisible');
		createInputErrorBoxText.textContent = err.message ?? 'Unexpected error';
	}
});
