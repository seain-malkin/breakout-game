import { vec3 } from "gl-matrix";

enum Axis {
    'X' = 0,
    'Y' = 1,
    'Z' = 2,
}

interface IAxisVector3D {
    vector: vec3;
    
    adjust(delta: number, axis: Axis): Promise<vec3>;

    reset(value: vec3): Promise<vec3>;
    reset(value: number, axis: Axis): Promise<vec3>;
    reset(value: vec3 | number, axis?: Axis): Promise<vec3>;
}

class Vector3D implements IAxisVector3D {
    protected _vector: vec3;
    private _changed = false;

    constructor(initial?: vec3) {
        this._vector = initial || vec3.create();
    }

    get vector() {
        return vec3.clone(this._vector);
    }

    get changed() {
        const changed = this._changed;
        this._changed = false;
        return changed;
    }

    set changed(value: boolean) {
        this._changed = value;
    }

    adjust(delta: number, axis: Axis): Promise<vec3> {
        this._vector[axis] += delta;
        this._changed = true;
        return Promise.resolve(this._vector);
    }

    reset(value: vec3 | number, axis?: Axis): Promise<vec3> {
        if (typeof value === "number") {
            this._vector[axis] = value;
        } else {
            this._vector = value;
        }
        this._changed = true;
        
        return Promise.resolve(this._vector);
    }

    clone(): Vector3D {
        const other = new Vector3D();
        other._vector = vec3.clone(this._vector);
        return other;
    }
}

export { 
    Axis, 
    Vector3D,
};