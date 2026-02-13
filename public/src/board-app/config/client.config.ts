import type { StrokeData } from '../../../../shared/board-elements/types/stroke-data.type.js';
import { Tools } from '../toolbox/enums/tools.enum.js';

export interface ClientConfiguration {
	defaultStrokeData: StrokeData;
	defaultTool: Tools;

	boardBackgroundColor: string;

	ovalSegments: number;

	minCameraScale: number;
	maxCameraScale: number;

	debugOverlay: boolean;

	strokeMinSize: number;
	strokeMaxSize: number;

	strokeToolDistanceThreshold: number;
}

export const clientConfiguration: ClientConfiguration = {
	defaultStrokeData: {
		color: '#000000',
		size: 6,
	},
	defaultTool: Tools.Pen,

	boardBackgroundColor: '#ffffff',

	ovalSegments: 32,

	minCameraScale: 0.1,
	maxCameraScale: 3,

	debugOverlay: true,

	strokeMaxSize: 20,
	strokeMinSize: 1,

	strokeToolDistanceThreshold: 3,
};
