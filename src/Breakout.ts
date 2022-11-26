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
import { Model } from './model/Model';
import keystate from './core/KeyState';
import { Acceleration, Movable } from './core/Physics';

const colors = {
    yellow: vec3.fromValues(1.0, 1.0, 0.0),
    green: vec3.fromValues(0.0, 1.0, 0.0),
    orange:vec3.fromValues(1.0, 0.0, 1.0),
    red: vec3.fromValues(1.0, 0.0, 0.0),
};

const rowColors: vec3[] = [ colors.red, colors.orange, colors.green, colors.yellow ];

/**
 * A simple Breakout clone based on the original rules described 
 * at https://en.wikipedia.org/wiki/Breakout_(video_game).
 * @author Seain Malkin
 */
class Breakout {
    private renderer: Renderer;
    private scene: Scene;
    private models = new Array<Model>();
    private paddle: Movable;

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
            const paddleModel = this.generatePaddle();
            this.paddle = new Movable(paddleModel);
            this.models.push(paddleModel, ...this.generateBricks());
            this.scene.addModel(tag, this.models);
            this.scene.movables.push(this.paddle);

            renderer.compose(this.scene);
            
            this.startRenderLoop();

            Promise.resolve(this);
        });
    }

    private generatePaddle(): Brick {
        const width = this.scene.width / 7;
        const heightRatio = 1.0 / 5.0;
        const height = width * heightRatio;
        const brick = new Brick(new BasicMaterial([1.0, 1.0, 1.0]));

        brick.localSpace.position.reset([0.5, 0.5]);
        brick.localSpace.scale.reset([width, height]);
        brick.worldSpace.position.reset((this.scene.width - width) / 2, Axis.X);
        brick.worldSpace.position.reset(60, Axis.Y);

        return brick;
    }

    private generateBricks(): Brick[] {
        const bricks = new Array<Brick>();
        const rows = 8;
        let rowIndex = 0;
        
        for (let row = 0; row < rows; row++) {
            bricks.push(...this.layBrickRow(row, new BasicMaterial(rowColors[rowIndex])));
            rowIndex += row % 2 ? 1 : 0;
        }

        return bricks;
    }

    private layBrickRow(row: number, material: Material): Brick[] {
        const bricks = new Array<Brick>();
        const columns = 14;
        const padding = 1;
        const heightRatio = 1.25 / 3.0;
        const width = this.scene.width / columns - padding * 2;
        const height = width * heightRatio - padding * 2;
        const baseBrick = new Brick(material);
        baseBrick.localSpace.position.reset([0.5, 0.5]);
        baseBrick.localSpace.scale.reset([width, height]);

        for (let c = 0; c < columns; c++) {
            const brick = baseBrick.clone();
            brick.worldSpace.position.reset(padding * c + width * c + padding, Axis.X);
            brick.worldSpace.position.reset(this.scene.height - height * (row + 1) - padding * row - padding, Axis.Y);
            bricks.push(brick);
        }

        return bricks;
    }

    private startRenderLoop() {
        let then = 0;

        keystate.enable(this.renderer.gl.canvas);

        const paddleAccel = new Acceleration([-20.0, 0.0]);

        let render = (now: DOMHighResTimeStamp) => {
            now *= 0.001;
            const deltaTime = now - then;
            then = now;

            if (keystate.keyDown('j')) {
                this.paddle.addForce(paddleAccel);
            }
            if (keystate.keyUp('j')) {
                this.paddle.removeForce(paddleAccel);
            }

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