/**
 * A sprite is a graphical object inside the game world 
 * with properties that can be manipulated as if it 
 * were a single entity.
 * 
 * A sprite consists of:
 * - a graphical representation
 * - a position in the game world
 * - an orientation in the game world
 * - a velocity (speed & direction) (Optional)
 * - a force acting upon it (Optional)
 * - an animation (Future Release)
 * 
 * A sprites velocity can be:
 * - Static (Stationary)
 * - Constant (No acceleration)
 * - Dynamic (Affected by forces)
 * 
 * A sprite can be manipulated by:
 * - position
 * - speed
 * - direction
 * - add or remove a force
 * - reset it's force
 */

import { mat4, vec3 } from "gl-matrix";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { Material } from "../material/Material";

class Mesh {
    geometry: GeometryBuffer; // Dependant
    material: Material; // Dependant
}

class Sprite {
    mesh: Mesh; // Dependant
    position: vec3;

}

class VectorSpace {
    private _transformation: mat4;
    private _position: vec3;
    private _scale: vec3;
    modified = true;

    get transformation() {
        const m = mat4.create();

        mat4.scale(m, m, this.scale);
        mat4.translate(m, m, this.position);
        
        this._transformation = m;
        this.modified = false;

        return this._transformation;
    }

    get position() {
        return this._position;
    }

    set position(u: vec3) {
        this._position = u;
        this.modified = true;
    }

    get scale() {
        return this._scale;
    }

    set scale(u: vec3) {
        this._scale = u;
        this.modified = true;
    }
}