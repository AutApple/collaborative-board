import type { Room } from '../../../board-app/generated/prisma/client.js';

export interface OutputBoardDTOType {
	id: string;
	name: string;
	createdAt: Date;
	pngBase64: string; 
}

export class OutputRoomDTO {
	public static fromModel(model: Room): OutputBoardDTOType {
		return {
			id: model.id,
			name: model.name,
			createdAt: model.createdAt,
			pngBase64: Buffer.from(model.thumbnailPngBytes).toString('base64')
		};
	}
}
