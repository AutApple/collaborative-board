import { OutputRoomEditorsDTO } from '../../../../shared/room/dto/output-room-editors.dto.js';
import { OutputRoomDTO } from '../../../../shared/room/dto/output-room.dto.js';
import authApi from '../../api/auth/auth.client-api.js';
import clientRoomsApi from '../../api/rooms/rooms.client-api.js';
import type { RoomSettingsState } from './types/room-settings-window.types.js';

export class RoomSettingsWindowAPI {
    public async retrieveRoomState(roomId: string): Promise<RoomSettingsState> {
        // TODO: send this data with handshake rather than use API
        const roomDataRaw = await fetch(`/api/rooms/${roomId}`);
        const fetchedEditorsRaw = await fetch(`/api/rooms/${roomId}/editors`);

        const fetchedEditors = await fetchedEditorsRaw.json();
        const roomData = await roomDataRaw.json();

        const parsedRoomData = OutputRoomDTO.parse(roomData);
        const parsedFetchedEditors = OutputRoomEditorsDTO.parse(fetchedEditors);
        
        return {
            isProtected: parsedRoomData.protectedMode,
            editorUsernames: [... parsedFetchedEditors.editors]
        };
    }

    public async getAccessToken(): Promise<string> {
        const accessToken = await authApi.getAccessToken();
        if (accessToken === null) throw new Error('Can\'t get auth token in room settings window');
        return accessToken;
    }

    public async switchProtectedMode(roomId: string, isProtected: boolean) {
        const accessToken = await this.getAccessToken();
        await clientRoomsApi.updateRoom(
            roomId,
            { protectedMode: isProtected },
            accessToken
        );
    }
    public async addEditor(roomId: string, username: string) {
        const accessToken = await this.getAccessToken();
        try {
            const editors = await clientRoomsApi.manageEditors([username], [], roomId, accessToken);
        } catch (err: any) {
            throw new Error('Can\'t add editor to this room!')
        } 
    }
    
    public async removeEditor(roomId: string, username: string) {
        const accessToken = await this.getAccessToken();
        try {
            const editors = await clientRoomsApi.manageEditors([], [username], roomId, accessToken);
        } catch (err: any) {
            throw new Error('Can\'t remove editor from this room!')
        } 
    }
}
