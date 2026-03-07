import { jsPanel } from 'jspanel4';
import { RoomSettingsWindowAPI } from './room-settings-window.api.js';
import type { RoomSettingsWindowState } from './types/room-settings-window.types.js';
import { RoomSettingsWindowDOM } from './room-settings-window.dom.js';
import type { Notyf } from 'notyf';

export class RoomSettingsWindow {
    private state: RoomSettingsWindowState = {
        isProtected: false,
        editorUsernames: [],
        isShown: false
    };

    private api: RoomSettingsWindowAPI;
    constructor(private document: Document) {
        this.api = new RoomSettingsWindowAPI();
    }

    private addEditor(dom: RoomSettingsWindowDOM, username: string, roomId: string, notifier: Notyf) {
        const { li, removeButton } = dom.addEditorToTheListComponent(username);
        removeButton.addEventListener('click', async () => {
            try {
                await this.api.removeEditor(roomId, username);
                li.remove();
                this.state.editorUsernames = this.state.editorUsernames.filter(e => e !== username);
            } catch (err: any) {
                notifier.error('Can\'t remove editor.');
            }
        });
    }

    public async show(roomId: string, notifier: Notyf) {
        if (this.state.isShown) return;
        this.state.isShown = true;

        let roomState = undefined;
        try {
            roomState = await this.api.retrieveRoomState(roomId);
        } catch (err: any) {
            this.state.isShown = false;
            throw new Error('Can\'t retrieve room data.');
        }

        const dom = new RoomSettingsWindowDOM(this.document);

        this.state.isProtected = roomState.isProtected;
        this.state.editorUsernames = [...roomState.editorUsernames];



        const { addEditorButton, editorUsernameInput, protectionSwitchButton } = dom.getComponents();

        protectionSwitchButton.textContent = this.state.isProtected ? 'On' : 'Off';

        protectionSwitchButton.addEventListener('click', async () => {
            try {
                await this.api.switchProtectedMode(roomId, !this.state.isProtected);
                this.state.isProtected = !this.state.isProtected;
                protectionSwitchButton.textContent = this.state.isProtected ? 'On' : 'Off';
            } catch (err: any) {
                notifier.error('Can\'t switch protected mode.');
            }
        });

        for (const editor of this.state.editorUsernames)
            this.addEditor(dom, editor, roomId, notifier);

        addEditorButton.addEventListener('click', async () => {
            const username = editorUsernameInput.value;
            if (username.trim() === '') return;

            try {
                await this.api.addEditor(roomId, username);

                this.state.editorUsernames.push(username);
                this.addEditor(dom, username, roomId, notifier);
                editorUsernameInput.value = '';
            } catch (err: any) {
                notifier.error('Can\'t add editor.');
            }
        });

        const template = jsPanel.createPanelTemplate();
        const root = dom.getRoot();
        template.querySelector('.jsPanel-content').append(root);

        jsPanel.create({
            position: 'center',
            template,
            headerTitle: 'Room Settings',
            contentSize: '700 350',
            theme: 'primary',
            onclosed: () => {
                this.state.isShown = false;
                this.state.editorUsernames = [];
            }
        });
    }
}