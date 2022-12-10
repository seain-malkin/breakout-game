import { mat4, vec3 } from "gl-matrix";
import { Transformational } from "./Transformational";

export class VectorSpace implements Transformational<vec3> {
    private _transformation: mat4;
    private position: vec3;
    private scaling: vec3;
    private reflection: vec3;
    private modified = true;

    get transformation(): mat4 {
        if (this.modified) {
            this.transform();
        }
        
        return this._transformation;
    }

    translate(delta: vec3): void {
        throw new Error("Method not implemented.");
    }

    scale(factor: number): void {
        throw new Error("Method not implemented.");
    }

    reflect(dimension: vec3): void {
        throw new Error("Method not implemented.");
    }

    private transform() {
        const m = mat4.create();

        mat4.scale(m, m, this.scaling);
        mat4.translate(m, m, this.position);
        mat4.translate(m, m, this.reflection);

        this._transformation = m;
        this.modified = false;
    }
    
}