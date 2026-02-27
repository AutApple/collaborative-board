import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type SemanticEventMap } from '../event-bus/index.js';

export class TopPanelUiAdapter {
	constructor(
		private document: Document,
		semanticEventBus: EventBus<SemanticEventMap>,
		saveButtonId: string = 'top-panel-save-button',
		copyLinkButtonId: string = 'top-panel-link-button',
	) {
		const saveButton = this.document.getElementById(saveButtonId) as HTMLButtonElement;
		const copyLinkButton = this.document.getElementById(copyLinkButtonId) as HTMLButtonElement;

		saveButton.addEventListener('click', (_) => {
			semanticEventBus.emit(SemanticEvents.TopPanelExportBoard, {});
		});
		copyLinkButton.addEventListener('click', (_) => {
			semanticEventBus.emit(SemanticEvents.TopPanelCopyLink, {});
		});
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
