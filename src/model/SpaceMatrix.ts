import { mat4 } from "gl-matrix";
import { Vector2D } from "../core/Axis2D";
import { vec2ToVec3 } from "../core/Util";

class SpaceMatrix {
    private _matrix = mat4.create();

    position = new Vector2D([0.0, 0.0]);
    scale = new Vector2D([1.0, 1.0]);

    constructor() {
        this.updateMatrix();
    }

    get matrix(): mat4 {
        if (this.position.changed || this.scale.changed) {
            this.updateMatrix();
        }

        return this._matrix;
    }

    clone(): SpaceMatrix {
        const other = new SpaceMatrix();
        other.copy(this);
        return other;
    }

    copy(from: SpaceMatrix) {
        this.position = from.position.clone();
        this.scale = from.scale.clone();
        this.updateMatrix();
    }

    private updateMatrix() {
        let m = mat4.create();
        
        mat4.scale(m, m, vec2ToVec3(this.scale));
        mat4.translate(m, m, vec2ToVec3(this.position));
        
        this._matrix = m;
    }
}

export { SpaceMatrix }