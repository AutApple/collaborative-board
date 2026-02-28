// command bus is used to communicate between API and board-app the way that board-app knows nothing about api and vice versa
// that prevents tight coupling and makes possible to update application state in real time when user communicates with REST API
export interface Command<R = void> {}

export type CommandHandler<C extends Command<any>> = (command: C) => Promise<any>;

export class CommandBus {
	private handlers = new Map<string, CommandHandler<any>>();

	register<C extends Command<any>>(commandName: string, handler: CommandHandler<C>) {
		this.handlers.set(commandName, handler);
	}

	async execute<C extends Command<any>>(command: C): Promise<any> {
		const handler = this.handlers.get(command.constructor.name);
		if (!handler) throw new Error('No handler registered');
		return handler(command);
	}
}
