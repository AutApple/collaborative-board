import type { StrokeData } from '../../../shared/board/elements/types/stroke-data.type.js';
import { Tools } from '../toolbox/enums/tools.enum.js';

export interface ClientConfiguration {
    defaultStrokeData: StrokeData;
    defaultTool: Tools;

    boardBackgroundColor: string;

    ovalSegments: number;

    minCameraScale: number;
    maxCameraScale: number;

    debugOverlay: boolean;
};

export const clientConfiguration: ClientConfiguration = {
    defaultStrokeData: {
        color: '#4a69f4',
        size: 6
    }, 
    defaultTool: Tools.Oval,

    boardBackgroundColor: '#ffffff',

    ovalSegments: 32,

    minCameraScale: 0.1,
    maxCameraScale: 3,
    
    debugOverlay: false
};