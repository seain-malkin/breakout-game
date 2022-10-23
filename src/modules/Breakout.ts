/// <reference path="index.d.ts" />
import materialVsSrc from './shader/material.vs.glsl';
import materialFsSrc from './shader/material.fs.glsl';
import { GL_VERTEX_SHADER, GL_FRAGMENT_SHADER } from 'webgl-constants';
import { Renderer } from './core/Renderer';
import { Plane } from './geometry/Plane';
import { Model } from './object/Model';
import { Material } from './material/Material';

/**
 * A simple Breakout clone based on the original rules described 
 * at https://en.wikipedia.org/wiki/Breakout_(video_game).
 * @author Seain Malkin
 */
class Breakout {
    private renderer: Renderer;

    constructor(canvasId: string) {
        this.renderer = new Renderer(canvasId);
    }

    initResources() {
        this.renderer.createProgram('material', [
            [ GL_VERTEX_SHADER, materialVsSrc ],
            [ GL_FRAGMENT_SHADER, materialFsSrc ],
        ]).then((program) => {
            const attrib = program.getAttribute('position');
            if (attrib == null) {
                throw new Error(`Attrib 'position' not found.`);
            }

            const model = new Model(new Plane(attrib.location), new Material());
            // Add to renderer
        });
    }
}

export { Breakout };