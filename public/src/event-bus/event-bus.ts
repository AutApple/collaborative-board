export class EventBus<Events extends Record<string, any>> {
	private listeners = new Map<keyof Events, Array<(payload: any) => void>>();

	on<K extends keyof Events>(type: K, handler: (payload: Events[K]) => void) {
		const list = this.listeners.get(type) ?? [];
		list.push(handler);
		this.listeners.set(type, list);
	}

	emit<K extends keyof Events>(type: K, payload: Events[K]) {
		const list = this.listeners.get(type);
		if (!list) return;

		for (const handler of list) {
			handler(payload); // each handler decides what to do
		}
	}
}
