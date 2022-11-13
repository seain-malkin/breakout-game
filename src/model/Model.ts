import { WorldModel } from "./WorldModel";
import { Program, ProgramInput } from "../core/Program";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { Material } from "../material/Material";
import { BufferComposable, BufferDrawable } from "../buffer/buffer";
import { mat4 } from "gl-matrix";
import { Vector2D } from "../core/Axis2D";
import { SpaceMatrix } from "./SpaceMatrix";

abstract class Model 
extends WorldModel
implements BufferComposable, BufferDrawable {
    localSpace = new SpaceMatrix();

    constructor(public geometry: GeometryBuffer, public material: Material) {
        super();
    }

    draw(gl: WebGL2RenderingContext, program: Program) {
        super.draw(gl, program);
        program.updateProperty(gl, ProgramInput.MODEL, this.localSpace.matrix);
        this.material.draw(gl, program);
        this.geometry.draw(gl);
    }

    compose(gl: WebGL2RenderingContext, program: Program): void {
        this.geometry.compose(gl, program);
    }

    decompose(gl: WebGL2RenderingContext): void {
        this.geometry.decompose(gl);
    }

    copy(from: Model) {
        super.copy(from);
        this.geometry = from.geometry;
        this.material = from.material.clone();
        this.localSpace = from.localSpace.clone();
    }
}

export { Model };