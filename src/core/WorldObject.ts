import { mat4 } from "gl-matrix";
import { Vector3D } from "./Axis3D";

abstract class WorldObject {
    private _modelView: mat4 = mat4.create();

    position = new Vector3D();
    scale = new Vector3D();

    constructor() {
        this.updateModelViewMatrix();
    }

    get modelView(): mat4 {
        if (this.position.changed || this.scale.changed) {
            this.updateModelViewMatrix();
        }
        return this._modelView;
    }

    private updateModelViewMatrix() {
        this._modelView = mat4.create();
        mat4.scale(this._modelView, this._modelView, this.scale.vector);
        mat4.translate(this._modelView, this._modelView, this.position.vector);
    }

    copy(from: WorldObject) {
        this.position = from.position.clone();
        this.scale = from.scale.clone();
        this.updateModelViewMatrix();
    }
}

export { WorldObject };