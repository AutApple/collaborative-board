import type { Cursor } from '../remote-cursor/types/cursor.js';

export function encodeRemoteCursor(cursor: Cursor): ArrayBuffer {
    const encoder = new TextEncoder();
    const idBytes = encoder.encode(cursor.clientId); //encode client id 

    if (idBytes.length > 255) throw new Error("too long client id");

    const buffer = new ArrayBuffer(1 + idBytes.length + 8); // 1 byte determing clientId length + id itself + 2 floats representing coordinates
    const view = new DataView(buffer);
    const uint8 = new Uint8Array(buffer);

    // put length of a clientId in the first byte
    uint8[0] = idBytes.length;

    // then each byte of a clientId
    uint8.set(idBytes, 1);

    // then put coordinates of a cursor
    view.setFloat32(1 + idBytes.length, cursor.worldCoords.x, true);
    view.setFloat32(1 + idBytes.length + 4, cursor.worldCoords.y, true);

    return buffer;
}

export function decodeRemoveCursor(buffer: ArrayBuffer): Cursor {
    const uint8 = new Uint8Array(buffer);
    const idLength = uint8[0]!;

    const decoder = new TextDecoder();
    const clientId = decoder.decode(uint8.subarray(1, 1 + idLength));

    const view = new DataView(buffer);
    const x = view.getFloat32(1 + idLength, true);
    const y = view.getFloat32(1 + idLength + 4, true);

    return { clientId, worldCoords: { x, y } };
}