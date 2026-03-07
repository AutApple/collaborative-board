import type { Notyf } from 'notyf';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type SemanticEventMap } from '../event-bus/index.js';
import { RoomSettingsWindow } from '../room-settings/room-settings-window.js';

export class TopPanelUiAdapter {
	
	private settingsWindow: RoomSettingsWindow;

	private buttons: {
		saveButton: HTMLButtonElement,
		copyLinkButton: HTMLButtonElement,
		showSettingsButton: HTMLButtonElement
	};

	constructor(
		private document: Document,
		semanticEventBus: EventBus<SemanticEventMap>,
		saveButtonId: string = 'top-panel-save-button',
		copyLinkButtonId: string = 'top-panel-link-button',
		showSettingsButtonId: string = 'top-panel-settings-button'
	) {
		this.settingsWindow = new RoomSettingsWindow(document);

		const saveButton = this.document.getElementById(saveButtonId) as HTMLButtonElement;
		const copyLinkButton = this.document.getElementById(copyLinkButtonId) as HTMLButtonElement;
		const showSettingsButton = this.document.getElementById(showSettingsButtonId) as HTMLButtonElement;

		this.buttons = {saveButton, copyLinkButton, showSettingsButton};
		saveButton.addEventListener('click', (_) => {
			semanticEventBus.emit(SemanticEvents.TopPanelExportBoard, {});
		});
		copyLinkButton.addEventListener('click', (_) => {
			semanticEventBus.emit(SemanticEvents.TopPanelCopyLink, {});
		});
		showSettingsButton.addEventListener('click', (_) => {
			semanticEventBus.emit(SemanticEvents.TopPanelOpenRoomSettings, {});
		})
	}

	public revealShowSettingsButton() {
		this.buttons.showSettingsButton.style.display = 'flex';
	}
	public showSettingsWindow(roomId: string, notifier: Notyf) {
		this.settingsWindow.show(roomId, notifier);
	}
	
	public downloadFile(blob: Blob) {
		const url = URL.createObjectURL(blob);

		const a = this.document.createElement('a');
		a.href = url;
		a.download = 'canvas.png';
		a.click();

		URL.revokeObjectURL(url);
	}

}
