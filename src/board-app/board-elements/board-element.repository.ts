import { BoardElementFactory } from '../../../shared/board-elements/board-element-factory.js';
import type { BaseBoardElement } from '../../../shared/board-elements/index.js';
import { BaseRepository } from '../common/base.repository.js';

export class BoardElementRepository extends BaseRepository<BaseBoardElement> {
	public async getAll(): Promise<BaseBoardElement[]> {
		const elements = await this.client.boardElement.findMany();
		const elementObjects: BaseBoardElement[] = [];
		for (const element of elements) {
			const { data } = element;
			const buffer: ArrayBuffer = data.buffer.slice(
				data.byteOffset,
				data.byteOffset + data.byteLength,
			);

			elementObjects.push(BoardElementFactory.fromEncoded(buffer, element.id));
		}
		return elementObjects;
	}

	private async insert(element: BaseBoardElement, boardId: string): Promise<BaseBoardElement> {
		const encoded = element.encode();
		const id = element.id;

		const data = Buffer.from(encoded);
		await this.client.boardElement.create({
			data: {
				id,
				data,
				boardId,
			},
		});
		return element;
	}

	private async update(element: BaseBoardElement, boardId: string): Promise<BaseBoardElement> {
		const encoded = element.encode();
		const data = Buffer.from(encoded);
		const id = element.id;
		await this.client.boardElement.update({
			where: { id, boardId },
			data: { data },
		});
		return element;
	}

	public async save(element: BaseBoardElement, boardId: string): Promise<BaseBoardElement> {
		const id = element.id;

		const el = await this.client.boardElement.findUnique({ where: { id } });
		if (!el) return this.insert(element, boardId);
		return this.update(element, boardId);
	}
}
