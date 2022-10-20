export { Brick };
import { vec3, mat4 } from "gl-matrix";

class Brick {
    // The base model matrix shared by all instances
    private static baseModel = mat4.create();

    // Instance model matrix translated by its position
    modelMatrix: mat4;

    /**
     * A destructable brick.
     * @param _position Position in projected space
     */
    constructor(private _position: vec3) {
        this.updateModelMatrix();
    }

    get position(): vec3 {
        return this._position;
    }

    set position(vector: vec3) {
        this._position = vector;
        this.updateModelMatrix();
    }
    
    /**
     * Scales the base model view matrix.
     * @param vector Scale factor of each axis
     */
    static scale(vector: vec3) {
        mat4.scale(Brick.baseModel, Brick.baseModel, vector);
    }

    /**
     * Update the model view matrix to reflect the position
     */
     private updateModelMatrix() {
        // Overwrite any existing matrix before translation
        this.modelMatrix = mat4.create();
        mat4.translate(this.modelMatrix, Brick.baseModel, this.position);
    }
}