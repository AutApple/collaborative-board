import { type XY } from '@shared/utils/vec2.utils.js';
import { BaseBoardElement } from '@shared/board/elements/';
import type { BoardDebugStats } from '@shared/board/board.js';
import { Camera } from '../camera/camera.js';
import type { BaseRenderLayer } from './layers/base.render-layer.js';
import { RenderLayerType } from './types/render-layer.type.js';
import { BoardElementsRenderLayer } from './layers/board-elements.render-layer.js';
import { DebugStatsRenderLayer } from './layers/debug-stats.render-layer.js';
import { StrokePreviewRenderLayer } from './layers/stroke-preview.render-layer.js';
import { clientConfiguration } from '../config/client.config.js';


export class Renderer {
    private ctx: CanvasRenderingContext2D;
    private layers: Map<RenderLayerType, BaseRenderLayer> = new Map<RenderLayerType, BaseRenderLayer>([
        [RenderLayerType.Elements, new BoardElementsRenderLayer()],
        [RenderLayerType.DebugStats, new DebugStatsRenderLayer()],
        [RenderLayerType.StrokePreview, new StrokePreviewRenderLayer()]
    ]);

    constructor(private canvas: HTMLCanvasElement) {
        const _ctx = canvas.getContext('2d');
        if (!_ctx) throw Error('Can\'t get 2D context of a canvas');
        this.ctx = _ctx;
        this.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    public resizeCanvas(w: number, h: number) {
        this.canvas.width = w;
        this.canvas.height = h;
    }


    public async saveBoardToPNG(camera: Camera): Promise<Blob> {
        const canvas = new OffscreenCanvas(this.canvas.width, this.canvas.height); // no HTML element needed
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Unable to make a canvas instance');
        
        ctx.fillStyle = '#ffffff'; // TODO: CANVAS BACKGROUND
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        this.layers.get(RenderLayerType.Elements)!.render(ctx, camera);

        const blob = await canvas.convertToBlob({ type: 'image/png' });
        return blob;
    }

    public getCanvasDimensions(): XY {
        return { x: this.canvas.width, y: this.canvas.height };
    }

    public setLayerData(layer: RenderLayerType, ...data: any) {
        this.layers.get(layer)?.updateData(...data);
    }

    public setLayerDataAndRender(camera: Camera, layer: RenderLayerType, ...data: any) {
        this.setLayerData(layer, ...data);
        this.renderAll(camera);
    }

    public refreshBoardLayersAndRender(camera: Camera, elements: BaseBoardElement[], debugStats: BoardDebugStats) {
        this.setLayerData(RenderLayerType.Elements, elements);
        this.setLayerData(RenderLayerType.DebugStats, debugStats);
        this.renderAll(camera);
    }

    public renderAll(camera: Camera) {
        this.clear();
        for (const layerType of this.layers.keys()) {
            if (layerType === RenderLayerType.DebugStats && !clientConfiguration.debugOverlay) continue; // TODO: layer.hide() and layer.show()
            const layer = this.layers.get(layerType);
            layer?.render(this.ctx, camera);
        }
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}