import type { Board } from '../../../board-app/generated/prisma/client.js';

export interface OutputBoardDTOType {
	id: string;
	name: string;
	createdAt: Date;
	pngBase64: string; 
}

export class OutputBoardDTO {
	public static fromModel(model: Board): OutputBoardDTOType {
		return {
			id: model.id,
			name: model.name,
			createdAt: model.createdAt,
			pngBase64: Buffer.from(model.pngThumbnail).toString('base64')
		};
	}
}
