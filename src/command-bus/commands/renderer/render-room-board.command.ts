import type { Command } from '../../command-bus';

export class RenderRoomBoardCommand implements Command<void> {
  constructor(public roomId: string) {}
}