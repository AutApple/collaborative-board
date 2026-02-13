import { ClientAPI } from '../api/client-api.js';

const createButton = document.getElementById('board-create-input');
const createInput = document.getElementById('board-name-input') as HTMLInputElement;

const createInputErrorBox = document.getElementById('board-name-input-errors');
const createInputErrorBoxText = document.getElementById('board-name-input-error-content');

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
        const newBoard = await ClientAPI.addBoard(boardName);
        window.location.href = `/board?id=${newBoard.id}`;
    } catch (err: any) {
        createInputErrorBox.classList.remove('invisible');
        createInputErrorBoxText.textContent = err.message ?? 'Unexpected error';
    }
});