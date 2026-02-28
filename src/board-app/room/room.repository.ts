import { Board } from '../../../shared/board/board.js';
import { type Board as BoardModel } from '../generated/prisma/client.js';
import { type Room as RoomModel } from '../generated/prisma/client.js';
import { type BoardElement as BoardElementModel } from '../generated/prisma/client.js';
import { BaseRepository } from '../common/base.repository.js';
import { BoardElementFactory } from '../../../shared/board-elements/board-element-factory.js';
import type { BaseBoardElement } from '../../../shared/board-elements/index.js';
import { validate as isUuid } from 'uuid';
import { Room } from '../../../shared/room/room.js';

export class RoomRepository extends BaseRepository<Room> {
	private boardModelToInstance(model: BoardModel & { elements?: BoardElementModel[] }): Board {
		const board = new Board(model.id);
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

	private roomModelToInstance(
		roomModel: RoomModel & { board: BoardModel & { elements?: BoardElementModel[] } },
	): Room {
		const boardInstance = this.boardModelToInstance(roomModel.board);
		const roomInstance = new Room({
			isLocal: false
		});
		roomInstance.initialize(roomModel.id, roomModel.name, boardInstance, []);
		return roomInstance;
	}

	public async get(id: string): Promise<Room | null> {
		if (!isUuid(id)) return null;
		const roomModel = await this.client.room.findUnique({
			where: { id },
			include: { board: { include: { elements: true } } },
		});
		if (!roomModel) return null;

		return this.roomModelToInstance(roomModel);
	}

	public async getAll(): Promise<Room[]> {
		const roomModels = await this.client.room.findMany({
			include: { board: { include: { elements: true } } },
		});

		const rooms = roomModels.map((r) => this.roomModelToInstance(r));
		return rooms;
	}

	private async update(room: Room, thumbnailPngBytes: Uint8Array<ArrayBuffer>): Promise<Room> {
		const roomId = room.getId();

		const roomModel = await this.client.room.findFirst({
			where: { id: roomId },
		});
		if (!roomModel) throw new Error("Can't find room with specified id on room update");

		await this.client.room.update({ where: { id: roomId }, data: { thumbnailPngBytes } }); // Update thumbnail

		const board = room.getBoard();
		const boardId = board.getId();
		if (!boardId) throw new Error(`Undefined board id on room update for room ${room.getName()}`);

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
		return room;
	}

	public async save(room: Room, thumbnailPngBytes: Uint8Array<ArrayBuffer>): Promise<Room> {
		//     const boardId = board.getId();
		//     if (boardId === undefined) return this.insert(board);

		//     const boardModel = await this.client.board.findUnique({
		//         where: { id: boardId },
		//     });
		//     if (!boardModel) return this.insert(board);
		//     return this.update(board);
		return this.update(room, thumbnailPngBytes);
	}
}
