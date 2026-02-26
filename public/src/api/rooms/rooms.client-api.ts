export interface ClientAPIRoom {
	id: string;
	name: string;
	createdAt: Date;
	pngBase64: string;
}
class ClientRoomsAPI {
	constructor(private url: string) {}
	async getPublicRooms(): Promise<Array<ClientAPIRoom>> {
		const response = await fetch(this.url);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const boards = await response.json();

		for (const board of boards)
			if (!board.name || !board.createdAt || !board.id)
				throw new Error(
					`Didn\'t retrieve proper board object on GET boards. Got instead: ${board}`,
				);

		return boards;
	}

	async addRoom(
		name: string,
		isPublic: boolean,
		accessToken?: string | undefined,
	): Promise<ClientAPIRoom> {
		const response = await fetch(this.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ name: name.trim(), public: isPublic }),
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(error || 'Failed to create room');
		}

		const data = await response.json();
		if (!data.name || !data.createdAt || !data.id)
			throw new Error(`Didn\'t retrieve proper board object on POST boards. Got instead: ${data}`);
		return data;
	}
}

const clientRoomsApi = new ClientRoomsAPI('/api/rooms');
export default clientRoomsApi;
