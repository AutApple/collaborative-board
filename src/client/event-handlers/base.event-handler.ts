import type { BoardServerSocket } from '../../../shared/socket-events/board.socket-events.js';
import type { AppContext } from '../../app-context.js';
import type { ServiceContainer } from '../../common/instance-container.js';
import type { Client } from '../client.js';

export abstract class BaseEventHandler {
	constructor(protected serviceContainer: ServiceContainer) {}
}
