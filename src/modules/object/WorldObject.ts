import { mat4, vec3 } from "gl-matrix";

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

export { WorldObject };