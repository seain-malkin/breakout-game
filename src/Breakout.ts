/// <reference path="./shader/glsl.d.ts" />
import materialVsSrc from './shader/material.vs.glsl';
import materialFsSrc from './shader/material.fs.glsl';
import { GL_VERTEX_SHADER, GL_FRAGMENT_SHADER } from 'webgl-constants';
import { Renderer } from './core/Renderer';
import { Brick } from './model/Brick';
import { Scene } from './core/Scene';
import { PerspectiveCamera } from './camera/PerspectiveCamera';
import { BasicMaterial } from './material/BasicMaterial';
import { Axis } from './core/Axis3D';

/**
 * A simple Breakout clone based on the original rules described 
 * at https://en.wikipedia.org/wiki/Breakout_(video_game).
 * @author Seain Malkin
 */
class Breakout {
    private renderer: Renderer;
    private scene: Scene;
    private bricks = new Array<Brick>();

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
            this.scene = new Scene(new PerspectiveCamera());

            const spacing = 0.015;
            const scaleY = 0.25;
            const brick = new Brick(new BasicMaterial([0.5, 0.5, 0.5]));
            brick.position.reset([-1.0, 0.0, -7.0]);
            brick.scale.reset([1.0, scaleY, 1.0]);

            const brick2 = brick.clone();
            brick2.position.adjust(1.0 + spacing, Axis.X);
            const brick3 = brick2.clone();
            brick3.position.adjust(1.0 + spacing, Axis.X);
            const brick4 = brick.clone();
            brick4.position.adjust(1.0 + spacing * (1 / scaleY), Axis.Y);
            brick4.material = new BasicMaterial([0.0, 1.0, 0.0]);
            const brick5 = brick4.clone();
            brick5.position.adjust(1.0 + spacing, Axis.X);
            const brick6 = brick5.clone();
            brick6.position.adjust(1.0 + spacing, Axis.X);

            this.bricks.push(brick);
            this.bricks.push(brick2);
            this.bricks.push(brick3);
            this.bricks.push(brick4);
            this.bricks.push(brick5);
            this.bricks.push(brick6);

            this.scene.addModel(tag, this.bricks);
            renderer.compose(this.scene);
            
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
    
            this.renderer.render(this.scene, deltaTime);
            requestAnimationFrame(render);
        }
    
        requestAnimationFrame(render);
    }

    destory() {
        return;
    }
}

export { Breakout };