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
            [ GL_VERTEX_SHADER, materialVsSrc ],
            [ GL_FRAGMENT_SHADER, materialFsSrc ],
        ]).then((result) => {
            const [tag, _] = result;
            this.scene = new Scene(new PerspectiveCamera());
            this.scene.camera.fov = 55;

            //this.generateBricks();
            const width = renderer.gl.canvas.clientWidth;
            const height = renderer.gl.canvas.clientHeight;
            
            console.log(width, height);
            const brick = new Brick(new BasicMaterial([1.0, 0.0, 1.0]));
            brick.position.reset([-9.0, 0.0, -0.0]);
            //brick.scale.reset(1.0 * (height / width), Axis.X);
            brick.scale.reset([1.0 / 14.0, 1.0 / 14.0, 1.0]);
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
        brickTemplate.position.reset([xOffset, 0.0, -7.0]);
        brickTemplate.scale.reset([1.0, scaleY, 1.0]);

        for (let row = 0; row < rows; row++) { 
            const material = new BasicMaterial(rowColors[Math.floor(row / 2)]);
            const padY = spacing * row * (1 / scaleY);
            for (let column = 0; column < columns; column++) {
                const padX = spacing * column;
                const brick = brickTemplate.clone();
                brick.position.adjust(column + padX, Axis.X);
                brick.position.adjust(row + padY, Axis.Y);
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