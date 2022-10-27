/// <reference path="./shader/glsl.d.ts" />
import materialVsSrc from './shader/material.vs.glsl';
import materialFsSrc from './shader/material.fs.glsl';
import { GL_VERTEX_SHADER, GL_FRAGMENT_SHADER } from 'webgl-constants';
import { Renderer } from './core/Renderer';
import { Plane } from './geometry/Plane';
import { Model } from './model/Model';
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

    create(): Promise<void | Breakout> {
        const renderer = this.renderer;
        return renderer.createProgram('material', [
            [ GL_VERTEX_SHADER, materialVsSrc ],
            [ GL_FRAGMENT_SHADER, materialFsSrc ],
        ]).then((result) => {
            const [tag, program] = result;
            const attrib = program.getAttribute('position');
            if (attrib == null) {
                throw new Error(`Attrib 'position' not found.`);
            }
            const plane = new Plane();
            const model = new Model(plane, new Material());
            const model2 = new Model(plane, new Material());
            renderer.addModel(tag, model);
            renderer.addModel(tag, model2);

            renderer.composeBuffers();
            this.run();
            Promise.resolve(this);
        });
    }

    private run() {
        let then = 0;

        let render = (now: DOMHighResTimeStamp) => {
            now *= 0.001;
            const deltaTime = now - then;
            then = now;
    
            this.renderer.render(deltaTime);
            requestAnimationFrame(render);
        }
    
        requestAnimationFrame(render);
    }

    destory() {
        return;
    }
}

export { Breakout };