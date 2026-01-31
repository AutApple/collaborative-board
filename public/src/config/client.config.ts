import type { StrokeData } from '../../../shared/board/elements/types/stroke-data.type.js';
import { Tools } from '../toolbox/enums/tools.enum.js';

export interface ClientConfiguration {
    defaultStrokeData: StrokeData;
    defaultTool: Tools;
    minCameraScale: number;
    maxCameraScale: number;

    debugOverlay: boolean;
};

export const clientConfiguration: ClientConfiguration = {
    defaultStrokeData: {
        color: 'black',
        size: 3
    }, 
    defaultTool: Tools.Pen,
    minCameraScale: 0.1,
    maxCameraScale: 3,
    
    debugOverlay: true
};