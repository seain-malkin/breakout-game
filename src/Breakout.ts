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

            //this.generateBricks();
            
            const brick = new Brick(new BasicMaterial([0.254, 0.6397, 0.8349]));
            brick.localSpace.scale.reset([641.25, 855.0]);
            this.bricks.push(brick);

            this.scene.addModel(tag, this.bricks);
            renderer.compose(this.scene);
            
            this.startRenderLoop();

            Promise.resolve(this);
        });
    }

    private generateBricks() {
        const columns = 9;
        const rows = 8;
        const spacing = 0.03;
        const scaleY = 0.25;
        const middle = Math.floor(columns / 2);
        const xOffset = ((middle * spacing) + middle) * -1;
        const brickTemplate = new Brick(new BasicMaterial([1.0, 1.0, 1.0]));
        brickTemplate.worldSpace.position.reset([xOffset, 0.0]);
        brickTemplate.worldSpace.scale.reset([1.0, scaleY]);

        for (let row = 0; row < rows; row++) { 
            const material = new BasicMaterial(rowColors[Math.floor(row / 2)]);
            const padY = spacing * row * (1 / scaleY);
            for (let column = 0; column < columns; column++) {
                const padX = spacing * column;
                const brick = brickTemplate.clone();
                brick.worldSpace.position.shift(column + padX, Axis.X);
                brick.worldSpace.position.shift(row + padY, Axis.Y);
                brick.material = material;
                this.bricks.push(brick);
            }
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