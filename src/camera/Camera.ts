/// <reference path="../index.d.ts" />
import { glMatrix, mat4 } from 'gl-matrix';
import { WorldObject } from '../object/WorldObject';

abstract class Camera extends WorldObject {
    protected _projectionMatrix = mat4.create();

    protected _fov: radian;

    private modified = false;

    constructor(
        fov: degree = 45,
        protected _aspect: number = 1,
        protected _near: number = 0.1,
        protected _far: number = 100,
    ) {
        super();
        this.fov = fov;
    }

    abstract updateProjectionMatrix(): void;

    get projectionMatrix() {
        if (this.modified) {
            this.updateProjectionMatrix();
            this.modified = false;
        }
        return this._projectionMatrix;
    }

    get fov() {
        return this._fov;
    }

    set fov(value: degree) {
        this._fov = glMatrix.toRadian(value);
        this.modified = true;
    }

    set aspect(value: number) {
        this._aspect = value;
        this.modified = true;
    }

    set near(value: number) {
        this._near = value;
        this.modified = true;
    }

    set far(value: number) {
        this._far = value;
        this.modified = true;
    }
}

export { Camera };