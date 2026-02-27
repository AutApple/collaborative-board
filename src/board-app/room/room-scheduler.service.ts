export class RoomSchedulerService {
	private timers: Map<string, NodeJS.Timeout> = new Map();

	constructor() {}

	public schedule(
		roomId: string,
		timerId: string,
		delayMs: number = 10000,
		callback: (roomId: string) => Promise<void>,
	) {
		const fullId = `${roomId}:${timerId}`;
		if (this.timers.has(fullId)) return;
		const timer = setTimeout(async () => {
			await callback(roomId);
			this.timers.delete(fullId);
		}, delayMs);
		this.timers.set(fullId, timer);
		console.log(`Scheduled ${timerId} for room ${roomId}`);
	}

	public scheduleRegular(
		roomId: string,
		timerId: string,
		intervalMs: number,
		callback: (roomId: string) => Promise<void>,
	) {
		const fullId = `${roomId}:${timerId}`;
		if (this.timers.has(fullId)) return;

		const interval = setInterval(async () => {
			try {
				await callback(roomId);
				console.log(`Regular task ${timerId} for room ${roomId}`);
			} catch (err) {
				console.error(`Error in regular task ${timerId} for room ${roomId}:`, err);
			}
		}, intervalMs);

		this.timers.set(fullId, interval as unknown as NodeJS.Timeout);
		console.log(`Scheduled regular task ${timerId} for room ${roomId}`);
	}

	public unschedule(roomId: string, timerId: string) {
		const fullId = `${roomId}:${timerId}`;
		const timer = this.timers.get(fullId);
		if (timer) {
			clearTimeout(timer);
			this.timers.delete(fullId);
			console.log(`Cancelled scheduled ${timerId} for room ${roomId}`);
		}
	}
}
