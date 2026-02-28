import type { AppContext } from '../app-context.js';
import {
	SemanticEvents,
	type EventBus,
	type SemanticEventMap,
	type TopPanelCopyLinkEvent,
	type TopPanelExportBoardEvent,
} from '../event-bus/index.js';
import type { TopPanelUiAdapter } from './top-panel.ui-adapter.js';

export class TopPanelController {
	constructor(
		private appContext: AppContext,
		private uiAdapter: TopPanelUiAdapter,
	) {}
	public subscribe(bus: EventBus<SemanticEventMap>) {
		bus.on(SemanticEvents.TopPanelExportBoard, this.onTopPanelExportBoard.bind(this));
		bus.on(SemanticEvents.TopPanelCopyLink, this.onTopPanelCopyLink.bind(this));
	}
	async onTopPanelExportBoard(_: TopPanelExportBoardEvent) {
		const blob = await this.appContext.renderer.saveBoardToPNG(this.appContext.camera);
		this.uiAdapter.downloadFile(blob);
	}
	async onTopPanelCopyLink(_: TopPanelCopyLinkEvent) {
		// TODO: more complicated hash-based server-side link generation
		const link = window.location.href;
		await navigator.clipboard.writeText(link);
		this.appContext.notyf.success('Successfully copied link to the clipboard!');
	} 
}
