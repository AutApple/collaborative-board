export interface RoomSettingsWindowDOMComponents {
    protectionSwitchButton: HTMLButtonElement,
    
    editorList:  HTMLUListElement,
    editorUsernameInput: HTMLInputElement,
    addEditorButton: HTMLButtonElement,
}

export interface RoomSettingsWindowEditorLiComponent {
    li: HTMLLIElement,
    span: HTMLSpanElement, 
    removeButton: HTMLElement;
}

export class RoomSettingsWindowDOM {
    private rootContainer: HTMLDivElement;
    private components: RoomSettingsWindowDOMComponents;

    constructor(private document: Document) {
        this.rootContainer = this.document.createElement('div');
        this.rootContainer.style.display = 'flex';
        this.rootContainer.style.padding = '2rem';
        this.rootContainer.style.flexDirection = 'column';

        // Protection mode DIV
        const protectionModeDiv = this.document.createElement('div');
        protectionModeDiv.style.display = 'flex';
        protectionModeDiv.style.flexDirection = 'row';
        protectionModeDiv.style.gap = '1rem';
        protectionModeDiv.style.alignItems = 'center';

        const protectedSpan = this.document.createElement('span');
        protectedSpan.textContent = 'Protection mode:';

        const protectedBtn = this.document.createElement('button');
        protectedBtn.className = 'jsPanel-btn jsPanel-btn-menu';
        protectedBtn.setAttribute('type', 'button');
        protectionModeDiv.appendChild(protectedSpan);
        protectionModeDiv.appendChild(protectedBtn);
        this.rootContainer.appendChild(protectionModeDiv);

        // Editor list div
        const editorList = this.document.createElement('ul');
        this.rootContainer.appendChild(editorList);

        const editorListInputsDiv = this.document.createElement('div');
        editorListInputsDiv.style.display = 'flex';
        editorListInputsDiv.style.flexDirection = 'row';
        editorListInputsDiv.style.gap = '1rem';

        const editorListUsernameInput = this.document.createElement('input');
        const editorListUsernameAdd = this.document.createElement('button');


        editorListUsernameAdd.textContent = 'Add editor';

        editorListInputsDiv.appendChild(editorListUsernameInput);
        editorListInputsDiv.appendChild(editorListUsernameAdd);
        
        this.rootContainer.appendChild(editorListInputsDiv);
        this.rootContainer.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });

        this.rootContainer.addEventListener('keyup', (e) => {
            e.stopPropagation();
        });

        this.components = {
            editorList,
            addEditorButton: editorListUsernameAdd,
            editorUsernameInput: editorListUsernameInput,
            protectionSwitchButton: protectedBtn
        };
    }
    public addEditorToTheListComponent(username: string): RoomSettingsWindowEditorLiComponent {
        const li = this.document.createElement('li');
        const span = this.document.createElement('span');
        span.textContent = username;
        const removeButton = this.document.createElement('i');
        removeButton.classList.add('fa-solid', 'fa-remove');
        removeButton.style.color = '#f05f5f';
        removeButton.style.cursor = 'pointer';
        li.appendChild(span);
        li.appendChild(removeButton);
        
        this.components.editorList.appendChild(li);
        return {
            li, span, removeButton
        };
    }
    public getComponents(): RoomSettingsWindowDOMComponents {
        return this.components;
    }
    public getRoot(): HTMLDivElement {
        return this.rootContainer;
    }
}
