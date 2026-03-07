import authApi from '../api/auth/auth.client-api.js';
import clientRoomsApi from '../api/rooms/rooms.client-api.js';

const createButton = document.getElementById('board-create-input');
const createInput = document.getElementById('board-name-input') as HTMLInputElement;

const createInputErrorBox = document.getElementById('board-name-input-errors');
const createInputErrorBoxText = document.getElementById('board-name-input-error-content');

const publicOnButton = document.getElementById('board-public-input') as HTMLInputElement;
const publicOffButton = document.getElementById('board-private-input') as HTMLInputElement;

const protectedOnButton = document.getElementById('board-protected-on-input') as HTMLInputElement;
const protectedOffButton = document.getElementById('board-protected-off-input') as HTMLInputElement;

const boardVisibilityWarning = document.getElementById('board-visibility-warning');
const boardProtectionWarning = document.getElementById('board-protection-warning');

async function visibilityButtonsInit(): Promise<void> {
	const accessToken = await authApi.getAccessToken();
	if (!accessToken) return;

	publicOnButton.disabled = false;
	publicOffButton.disabled = false;
	protectedOffButton.disabled = false;
	protectedOnButton.disabled = false;

	boardVisibilityWarning!.textContent = '';
	boardProtectionWarning!.textContent = '';
}

if (!publicOnButton || !publicOffButton || !boardVisibilityWarning)
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
			{
				name: boardName,
				public: publicOnButton.checked,
				protectedMode: protectedOnButton.checked,
			},

			accessToken ?? undefined,
		);
		window.location.href = `/board?id=${newBoard.id}`;
	} catch (err: any) {
		createInputErrorBox.classList.remove('invisible');
		createInputErrorBoxText.textContent = err.message ?? 'Unexpected error';
	}
});
