import { Board } from '../../../shared/board/board.js';
import { type Board as BoardModel } from '../generated/prisma/client.js';
import { type BoardElement as BoardElementModel } from '../generated/prisma/client.js';
import { serverConfiguraion } from '../config/server.config.js';
import { BaseRepository } from '../common/base.repository.js';
import { BoardElementFactory } from '../../../shared/board-elements/board-element-factory.js';
import type { BaseBoardElement } from '../../../shared/board-elements/index.js';
import { validate as isUuid } from 'uuid';
import { ServerRendererService } from '../renderer/renderer.service.js';

export class BoardRepository extends BaseRepository<Board> {
	private boardModelToInstance(model: BoardModel & { elements?: BoardElementModel[] }) {
		const board = new Board(model.id, model.name);
		if (!model.elements) return board;

		for (const element of model.elements) {
			const elementId = element.id;
			const data = element.data;
			const buffer: ArrayBuffer = data.buffer.slice(
				data.byteOffset,
				data.byteOffset + data.byteLength,
			);

			const elementInstance = BoardElementFactory.fromEncoded(buffer, elementId);
			board.appendElement(elementInstance);
		}
		return board;
	}
	private elementInstanceToModel(element: BaseBoardElement, boardId: string): BoardElementModel {
		const encoded = element.encode();
		const data = Buffer.from(encoded);
		const id = element.id;
		return { id, data, boardId };
	}

	public async get(id: string): Promise<Board | null> {
		if (!isUuid(id)) return null;
		const boardModel = await this.client.board.findUnique({ where: { id } });
		if (!boardModel) return null;
		const board = this.boardModelToInstance(boardModel);
		return board;
	}

	public async getAll(): Promise<Board[]> {
		const boardModels = await this.client.board.findMany({
			include: { elements: true },
		});
		const boards = boardModels.map((b) => this.boardModelToInstance(b));
		return boards;
	}

	private async insert(board: Board, thumbnailBytes: Uint8Array<ArrayBuffer>): Promise<Board> {
		const boardModel = await this.client.board.create({
			data: { name: board.getName() ?? serverConfiguraion.generateCoolBoardNamePls(), pngThumbnail: thumbnailBytes },
		});

		const elementInstances = board.getElements();
		const elementModels: BoardElementModel[] = elementInstances.map((e) =>
			this.elementInstanceToModel(e, boardModel.id),
		);

		if (elementModels.length > 0)
			await this.client.boardElement.createMany({ data: elementModels });

		board.setMetadata({ id: boardModel.id, name: boardModel.name });
		return board;
	}

	private async update(board: Board, thumbnailBytes: Uint8Array<ArrayBuffer>): Promise<Board> {
		const boardId = board.getId();
		if (!boardId) throw new Error('Undefined board id on board update');

		const boardModel = await this.client.board.findFirst({
			where: { id: boardId },
		});
		if (!boardModel) throw new Error('Unknown board id on board update');
		
		await this.client.board.update({where: {id: boardId}, data: {pngThumbnail: thumbnailBytes}});

		const elementInstances = board.getElements();
		const elementModels: BoardElementModel[] = elementInstances.map((e) =>
			this.elementInstanceToModel(e, boardId),
		);

		const newIds = elementModels.map((e) => e.id);
		await this.client.$transaction(async (tx) => {
			await tx.boardElement.deleteMany({ where: { boardId, id: { notIn: newIds } } });
			for (const el of elementModels)
				await tx.boardElement.upsert({
					where: { id: el.id },
					update: { data: el.data },
					create: el,
				});
		});
		return board;
	}

	public async save(board: Board, thumbnailBytes: Uint8Array<ArrayBuffer>): Promise<Board> {
		const boardId = board.getId();
		if (boardId === undefined) return this.insert(board, thumbnailBytes);

		const boardModel = await this.client.board.findUnique({
			where: { id: boardId },
		});
		if (!boardModel) return this.insert(board, thumbnailBytes);
		return this.update(board, thumbnailBytes);
	}
}
