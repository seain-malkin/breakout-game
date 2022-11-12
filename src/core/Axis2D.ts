import { vec2 } from "gl-matrix";

enum Axis {
    'X' = 0,
    'Y' = 1,
}

interface IVector2D {
    vector: vec2;
    
    adjust(delta: number, axis: Axis): Promise<vec2>;

    reset(value: vec2): Promise<vec2>;
    reset(value: number, axis: Axis): Promise<vec2>;
    reset(value: vec2 | number, axis?: Axis): Promise<vec2>;
}

class Vector2D implements IVector2D {
    protected _vector: vec2;
    private _changed = false;

    constructor(initial?: vec2) {
        this._vector = initial || vec2.create();
    }

    get vector() {
        return vec2.clone(this._vector);
    }

    get changed() {
        const changed = this._changed;
        this._changed = false;
        return changed;
    }

    set changed(value: boolean) {
        this._changed = value;
    }

    adjust(delta: number, axis: Axis): Promise<vec2> {
        this._vector[axis] += delta;
        this._changed = true;
        return Promise.resolve(this._vector);
    }

    reset(value: vec2 | number, axis?: Axis): Promise<vec2> {
        if (typeof value === "number") {
            this._vector[axis] = value;
        } else {
            this._vector = value;
        }
        this._changed = true;
        
        return Promise.resolve(this._vector);
    }

    clone(): Vector2D {
        const other = new Vector2D();
        other._vector = vec2.clone(this._vector);
        return other;
    }
}

export { 
    Axis, 
    Vector2D,
};