import { BoardElementFactory } from '../../shared/board-elements/board-element-factory.js';
import type { BaseBoardElement } from '../../shared/board-elements/index.js';
import { BaseRepository } from './base.repository.js';

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

	public async insert(element: BaseBoardElement): Promise<void> {
		const encoded = element.encode();
		const id = element.id;

		const data = Buffer.from(encoded);
		await this.client.boardElement.create({
			data: {
				id,
				data,
			},
		});
	}

	public async upsert(element: BaseBoardElement): Promise<void> {
		const id = element.id;

		const el = await this.client.boardElement.findFirst({ where: { id } });
		if (!el) return this.insert(element);

		const encoded = element.encode();
		const data = Buffer.from(encoded);

		await this.client.boardElement.update({
			where: { id },
			data: { data },
		});
	}
}
