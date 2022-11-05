import { WorldObject } from "../core/WorldObject";
import { Program } from "../core/Program";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { Material } from "../material/Material";
import { BufferComposable, BufferDrawable } from "../buffer/buffer";

abstract class Model 
extends WorldObject
implements BufferComposable, BufferDrawable {
    constructor(public geometry: GeometryBuffer, public material: Material) {
        super();
    }

    draw(gl: WebGL2RenderingContext, program: Program) {
        program.updateProperty(gl, 'modelView', this.modelView);
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
    }
}

export { Model };