import { Cursor } from '../cursor/cursor.js';
import { Vec2, type XY } from '../utils/vec2.utils.js';
import { ClientData } from './client-data.js';

export class ClientDataMap {
	private map: Map<string, ClientData> = new Map();

	constructor(...clientDataList: ClientData[]) {
		for (const clientData of clientDataList) this.map.set(clientData.clientId, clientData);
	}

	public get(clientId: string): ClientData | undefined {
		return this.map.get(clientId);
	}

	public addClientData(clientData: ClientData) {
		this.map.set(clientData.clientId, clientData);
	}

	public removeClientData(clientId: string) {
		this.map.delete(clientId);
	}

	public foreignDataToList(): ClientData[] {
		const list: ClientData[] = [];
		for (const clientId of this.map.keys()) {
			const clientData = this.map.get(clientId)!;
			if (!clientData.isLocal) list.push(clientData);
		}
		return list;
	}

	public getClientAmount(): number {
		return this.map.size;
	}
}
