import { vec3 } from "gl-matrix";
import { Program, ProgramInput } from "../core/Program";
import { Material } from "./Material";

class BasicMaterial extends Material {

    constructor(public color: vec3) {
        super();
    }

    draw(gl: WebGL2RenderingContext, program: Program): void {
        program.updateProperty(gl, ProgramInput.COLOR, this.color);
    }

    clone(): Material {
        const other = new BasicMaterial(vec3.clone(this.color));
        return other;
    }
}

export { BasicMaterial };