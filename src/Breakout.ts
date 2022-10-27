/// <reference path="./shader/glsl.d.ts" />
import materialVsSrc from './shader/material.vs.glsl';
import materialFsSrc from './shader/material.fs.glsl';
import { GL_VERTEX_SHADER, GL_FRAGMENT_SHADER } from 'webgl-constants';
import { Renderer } from './core/Renderer';
import { Brick } from './model/Brick';
import { Scene } from './core/Scene';
import { PerspectiveCamera } from './camera/PerspectiveCamera';

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
            const [tag, _] = result;
            const scene = new Scene(new PerspectiveCamera());
            const brick = new Brick();

            scene.addModel(tag, brick);
            renderer.compose(scene);
            
            this.startRenderLoop();

            Promise.resolve(this);
        });
    }

    private startRenderLoop() {
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