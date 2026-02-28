import type { Command } from '../../command-bus';

export class RenderBlankCommand implements Command<void> {
  constructor() {}
}