import { OutputRoomDTO, type OutputRoomDTOType } from '@shared/room/dto/output-room.dto.js';
import { type CreateRoomDTOType } from '@shared/room/dto/create-room.dto.js';

function parseData(data: unknown): OutputRoomDTOType {
	const parsed = OutputRoomDTO.safeParse(data);

	if (!parsed.success) throw new Error(`Invalid room object ${parsed.error}`);
	return parsed.data;
}

class ClientRoomsAPI {
	constructor(private readonly url: string) {}

	private buildHeaders(accessToken?: string): HeadersInit {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};
		if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
		return headers;
	}

	private async parseResponse(response: Response): Promise<unknown> {
		if (!response.ok) {
			const message = await response.text();
			throw new Error(message || `HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	async getPublicRooms(): Promise<OutputRoomDTOType[]> {
		const response = await fetch(this.url);
		const data = await this.parseResponse(response);

		if (!Array.isArray(data)) throw new Error('Expected an array of rooms');

		return data.map((room) => parseData(room));
	}

	async addRoom(dto: CreateRoomDTOType, accessToken?: string): Promise<OutputRoomDTOType> {
		const response = await fetch(this.url, {
			method: 'POST',
			headers: this.buildHeaders(accessToken),
			body: JSON.stringify({
				name: dto.name.trim(),
				public: dto.public,
				protectedMode: dto.protectedMode,
			}),
		});

		const data = await this.parseResponse(response);
		const output = parseData(data);
		return output;
	}

	async manageEditors(
		usersToAdd: string[],
		usersToRemove: string[],
		roomId: string,
		accessToken: string,
	): Promise<void> {
		const response = await fetch(`${this.url}/${roomId}/editors`, {
			method: 'PATCH',
			headers: this.buildHeaders(accessToken),
			body: JSON.stringify({
				add: usersToAdd,
				remove: usersToRemove,
			}),
		});
		if (!response.ok) throw new Error('error on managing editors');
	}
}

const clientRoomsApi = new ClientRoomsAPI('/api/rooms');
export default clientRoomsApi;
