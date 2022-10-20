import materialVsSrc from './material.vs.glsl';
import materialFsSrc from './material.fs.glsl';
import { Geometry } from './Geometry';
import * as GL_ from 'webgl-constants';

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
            [ GLSHADER.VERTEX, materialVsSrc ],
            [ GLSHADER.FRAGMENT, materialFsSrc ],
        ]);
    }
}

class WorldObject {

}



class Material {

}

class ModelMesh extends WorldObject {
    constructor(public geometry: Geometry, public material: Material) {
        super();
    }
}

class Renderer {
    private _context: WebGL2RenderingContext;
    private canvasElement: HTMLCanvasElement;

    private rawPrograms = new Array<RawProgram>();

    constructor(canvasId: string) {
        this.canvasElement = this.getCanvasElement(canvasId);
        this._context = this.getCanvasContext(this.canvasElement);
        
    }

    get context(): WebGL2RenderingContext {
        return this._context;
    }

    createProgram(tag: string, shaders: RawShader[]) {
        this.rawPrograms.push({ tag: tag, shaders: shaders });
    }

    private getCanvasContext(element: HTMLCanvasElement): WebGL2RenderingContext {
        const context = element.getContext("webgl2");
        if (context == null) {
            throw new Error(`WebGL2 not supported by browser`);
        }

        return context;
    }

    private getCanvasElement(elementId: string): HTMLCanvasElement {
        const element = <HTMLCanvasElement>document.querySelector(`#${elementId}`);
        if (element == null) {
            throw new Error(`Can't find element ${elementId}`);
        }

        return element;
    }
}

const enum GLSHADER {
    'VERTEX' = 0x8B31,
    'FRAGMENT' = 0x8B30,
};

type RawShader = [ GLenum, string ];

interface RawProgram {
    // Unique identifier to reference the program
    tag: string;

    // Array of shaders to compile and link with program
    shaders: RawShader[];
}