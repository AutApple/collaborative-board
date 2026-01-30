export interface ServerConfiguration {
    cursorMoveThrottlingTimeoutMs: number;
    boardMutationsThrottlingTimeoutMs: number;
    requestRefreshThrottlingTimeoutMs: number;

    handshakeTimeoutMs: number;
}

export const defaultServerConfig: ServerConfiguration = {
    cursorMoveThrottlingTimeoutMs: 16,
    boardMutationsThrottlingTimeoutMs: 100,
    requestRefreshThrottlingTimeoutMs: 1000,

    handshakeTimeoutMs: 5000
};