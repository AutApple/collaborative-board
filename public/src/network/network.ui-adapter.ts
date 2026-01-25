export class NetworkUiAdapter { 
    private disconnectOverlayElement: HTMLDivElement;
    private disconnectTextElement: HTMLHeadingElement;
    constructor (document: Document, disconnectOverlayId: string = 'disconnect-overlay', disconnectTextId = 'disconnect-text') {
        this.disconnectOverlayElement = document.getElementById(disconnectOverlayId) as HTMLDivElement;
        this.disconnectTextElement = document.getElementById(disconnectTextId) as HTMLHeadingElement;
        if (!this.disconnectOverlayElement || !this.disconnectTextElement) throw Error('Can\'t retrieve overlay elements');
        console.log('yo');
    }
    showDisconnectOverlay() {
        this.disconnectOverlayElement.classList.remove('disabled');
        this.disconnectTextElement.classList.remove('disabled');
    }
    hideDisconnectOverlay() {
        console.log('yaman');
        this.disconnectOverlayElement.classList.add('disabled');
        this.disconnectTextElement.classList.add('disabled');        
    }
}
