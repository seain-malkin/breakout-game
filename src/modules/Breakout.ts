import materialVsSrc from './material.vs.glsl';
import materialFsSrc from './material.fs.glsl';
import { Renderer } from './core/Renderer';
import { GL_VERTEX_SHADER, GL_FRAGMENT_SHADER } from 'webgl-constants';
import { PlaneGeometry } from './geometry/PlaneGeometry';

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
            const attrib = program.getAttribute('aVertexPosition');
            if (attrib == null) {
                throw new Error('Attrib aVertexPosition not found.');
            }

            const plane = new PlaneGeometry(attrib.location);
            // Create model and add to renderer
        });
    }
}

class WorldObject {
    // modelViewMatrix
}



class Material {

}

class ModelMesh extends WorldObject {
    constructor(public geometry: Geometry, public material: Material) {
        super();
    }
}

class Brick extends ModelMesh {
    constructor() {
        super();
    }
}