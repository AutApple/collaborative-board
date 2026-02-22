export interface ServerConfiguration {
	cursorMoveThrottlingTimeoutMs: number;
	boardMutationsThrottlingTimeoutMs: number;
	requestRefreshThrottlingTimeoutMs: number;

	handshakeTimeoutMs: number;
	// generateCoolBoardNamePls: () => string;

	thumbnailViewportWidth: 1920;
	thumbnailViewportHeight: 1080;
}

export const serverConfiguraion: ServerConfiguration = {
	cursorMoveThrottlingTimeoutMs: 16,
	boardMutationsThrottlingTimeoutMs: 100,
	requestRefreshThrottlingTimeoutMs: 1000,

	handshakeTimeoutMs: 5000,

	thumbnailViewportWidth: 1920,
	thumbnailViewportHeight: 1080,
	// generateCoolBoardNamePls: () => {
	// 	const intensities = ['Aggressively', 'Mildly', 'Suspiciously', 'Majestically'];
	// 	const textures = ['Damp', 'Crusty', 'Velvety', 'Greasy'];
	// 	const absurdities = ['Ham-scented', 'Existential', 'Glitter-covered', 'Noodle-like'];

	// 	const pick = (arr: Array<string>) => arr[Math.floor(Math.random() * arr.length)];
	// 	return `${pick(intensities)} ${pick(textures)} ${pick(absurdities)} Whiteboard`;
	// },
};
