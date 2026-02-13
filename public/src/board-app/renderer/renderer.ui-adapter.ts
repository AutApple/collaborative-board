import { SemanticEvents, type EventBus, type SemanticEventMap } from '../event-bus/index.js';

export class RendererUiAdapter {
	constructor(
		private document: Document,
		semanticEventBus: EventBus<SemanticEventMap>,
		saveButtonId: string = 'top-panel-save-button',
	) {
		const saveButton = document.getElementById(saveButtonId) as HTMLButtonElement;
		saveButton.addEventListener('click', (_) => {
			semanticEventBus.emit(SemanticEvents.RendererExportBoard, {});
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
