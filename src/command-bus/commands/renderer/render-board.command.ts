import type { Command } from '../../command-bus'
export class RenderBoardCommand implements Command<void> {
  constructor(public roomId: string) {}
}