import type { ServiceContainer } from '../../common/instance-container.js';

export abstract class BaseEventHandler {
	constructor(protected serviceContainer: ServiceContainer) {}
}
