/// <reference path="index.d.ts" />
import materialVsSrc from './shader/material.vs.glsl';
import materialFsSrc from './shader/material.fs.glsl';
import { Renderer } from './core/Renderer';
import { GL_VERTEX_SHADER, GL_FRAGMENT_SHADER } from 'webgl-constants';
import { GeometryBuffer } from './buffer/GeometryBuffer';
import { Plane } from './geometry/Plane';
import { Program } from './core/Program';
import { mat4, vec3 } from 'gl-matrix';

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

            const model = new ModelMesh(new Plane(attrib.location), new Material());
            // Add to renderer
        });
    }
}

abstract class WorldObject {
    _modelView: mat4 = mat4.create();

    _position: vec3 = [0.0, 0.0, 0.0];
    _scale: vec3 = [1.0, 1.0, 1.0];

    modified = true;

    get modelView(): mat4 {
        if (this.modified) {
            this._modelView = mat4.create();
            mat4.scale(this._modelView, this._modelView, this.scale);
            mat4.translate(this._modelView, this._modelView, this.position);
            this.modified = false;
        }

        return this._modelView;
    }

    get position(): vec3 {
        return this._position;
    }

    set position(value: vec3) {
        this._position = value;
        this.modified = true;
    }

    get scale(): vec3 {
        return this._scale;
    }

    set scale(value: vec3) {
        this._scale = value;
        this.modified = true;
    }

    copy() {
        return {...this};
    }
}

class Material {
    color: vec3 = [0.5, 0.5, 0.5];
}

class ModelMesh extends WorldObject {
    constructor(public geometry: GeometryBuffer, public material: Material) {
        super();
    }

    draw(gl: WebGL2RenderingContext, program: Program) {
        program.use(gl);
        program.updateProperty(gl, 'modelView', this.modelView);
        program.updateProperty(gl, 'color', this.material.color);
        this.geometry.draw(gl);
    }

    copy() {
        return {...super.copy(), ...this};
    }
}

export { Breakout };