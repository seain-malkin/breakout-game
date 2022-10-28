import { mat4, vec3 } from "gl-matrix";

abstract class WorldObject {
    private _modelView: mat4 = mat4.create();

    private _position: vec3 = [0.0, 0.0, 0.0];
    private _scale: vec3 = [1.0, 1.0, 1.0];

    constructor() {
        this.updateModelViewMatrix();
    }

    get modelView(): mat4 {
        return this._modelView;
    }

    get position(): vec3 {
        return this._position;
    }

    set position(value: vec3) {
        this._position = value;
        this.updateModelViewMatrix();
    }

    get scale(): vec3 {
        return this._scale;
    }

    set scale(value: vec3) {
        this._scale = value;
        this.updateModelViewMatrix();
    }

    private updateModelViewMatrix() {
        this._modelView = mat4.create();
        mat4.scale(this._modelView, this._modelView, this.scale);
        mat4.translate(this._modelView, this._modelView, this.position);
    }

    copy(from: WorldObject) {
        this._position = vec3.clone(from._position);
        this._scale = vec3.clone(from._scale);
        this.updateModelViewMatrix();
    }
}

export { WorldObject };