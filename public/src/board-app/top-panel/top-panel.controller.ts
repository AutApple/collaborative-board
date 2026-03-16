import type { AppContext } from '../app-context.js';
import {
	SemanticEvents,
	type EventBus,
	type SemanticEventMap,
	type TopPanelCopyLinkEvent,
	type TopPanelExportBoardEvent,
	type TopPanelOpenRoomSettingsEvent,
	type TopPanelRevealRoomSettingsEvent,
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
		bus.on(SemanticEvents.TopPanelOpenRoomSettings, this.onTopPanelOpenRoomSettings.bind(this));
		bus.on(SemanticEvents.TopPanelRevealRoomSettings, this.onTopPanelRevealRoomSettings.bind(this));
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
	onTopPanelOpenRoomSettings(_: TopPanelOpenRoomSettingsEvent) {
		try {
			this.uiAdapter.showSettingsWindow(this.appContext.room.getId(), this.appContext.notyf);
		} catch (err: any) {
			if (err instanceof Error) {
				this.appContext.notyf.error(err.message);
			}
		}
	}

	onTopPanelRevealRoomSettings(_: TopPanelRevealRoomSettingsEvent) {
		this.uiAdapter.revealShowSettingsButton();
	}
}
