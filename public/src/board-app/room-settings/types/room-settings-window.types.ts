export interface RoomSettingsState {
    isProtected: boolean,
    editorUsernames: string[]
}

export interface RoomSettingsWindowState extends RoomSettingsState {
    isShown: boolean;
}