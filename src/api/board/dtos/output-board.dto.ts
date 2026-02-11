import type { Board } from '../../../board-app/generated/prisma/client.js';

export interface OutputBoardDTOType {
	id: string;
	name: string;
	createdAt: Date;
}

export class OutputBoardDTO {
	public static fromModel(model: Board): OutputBoardDTOType {
		return {
			id: model.id,
			name: model.name,
			createdAt: model.createdAt,
		};
	}
}
