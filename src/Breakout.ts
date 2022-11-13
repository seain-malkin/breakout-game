/// <reference path="./shader/glsl.d.ts" />
import basicVertSrc from './shader/basic.vs.glsl';
import basicFragSrc from './shader/basic.fs.glsl';
import { GL_VERTEX_SHADER, GL_FRAGMENT_SHADER } from 'webgl-constants';
import { Renderer } from './core/Renderer';
import { Brick } from './model/Brick';
import { Scene } from './core/Scene';
import { BasicMaterial } from './material/BasicMaterial';
import { Axis } from './core/Axis2D';
import { vec3 } from 'gl-matrix';
import { Material } from './material/Material';

const colors = {
    yellow: vec3.fromValues(1.0, 1.0, 0.0),
    green: vec3.fromValues(0.0, 1.0, 0.0),
    orange:vec3.fromValues(1.0, 0.0, 1.0),
    red: vec3.fromValues(1.0, 0.0, 0.0),
};

const rowColors: vec3[] = [colors.yellow, colors.green, colors.orange, colors.red];

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
            [ GL_VERTEX_SHADER, basicVertSrc ],
            [ GL_FRAGMENT_SHADER, basicFragSrc ],
        ]).then((result) => {
            const [tag, _] = result;
            this.scene = new Scene();
            this.layBrickRow(0, new BasicMaterial([0.2, 0.7, 0.4]));
            this.layBrickRow(1, new BasicMaterial([0.7, 0.2, 0.4]));
            this.layBrickRow(2, new BasicMaterial([0.4, 0.2, 0.7]));
            this.layBrickRow(3, new BasicMaterial([0.6, 0.8, 0.2]));
            this.layBrickRow(4, new BasicMaterial([0.2, 0.8, 0.6]));

            this.scene.addModel(tag, this.bricks);
            renderer.compose(this.scene);
            
            this.startRenderLoop();

            Promise.resolve(this);
        });
    }

    private layBrickRow(row: number, material: Material) {
        const columns = 14;
        const padding = 2;
        const heightRatio = 1.5 / 3.0;
        const width = this.scene.width / columns - padding * 2;
        const height = width * heightRatio - padding * 2;
        const baseBrick = new Brick(material);
        baseBrick.localSpace.position.reset([0.5, 0.5]);
        baseBrick.localSpace.scale.reset([width, height]);

        for (let c = 0; c < columns; c++) {
            const brick = baseBrick.clone();
            brick.worldSpace.position.reset(padding * c + width * c + padding, Axis.X);
            brick.worldSpace.position.reset(this.scene.height - height * (row + 1) - padding * row - padding, Axis.Y);
            this.bricks.push(brick);
        }
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