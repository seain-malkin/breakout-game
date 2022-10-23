import { WorldObject } from "./WorldObject";
import { Program } from "../core/Program";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { Material } from "../material/Material";
import { BufferComposable, BufferDrawable } from "../buffer/buffer";

class Model 
extends WorldObject
implements BufferComposable, BufferDrawable {
    constructor(public geometry: GeometryBuffer, public material: Material) {
        super();
    }

    draw(gl: WebGL2RenderingContext, program: Program) {
        program.use(gl);
        program.updateProperty(gl, 'modelView', this.modelView);
        program.updateProperty(gl, 'color', this.material.color);
        this.geometry.draw(gl);
    }

    compose(gl: WebGL2RenderingContext): void {
        this.geometry.compose(gl);
    }

    decompose(gl: WebGL2RenderingContext): void {
        this.geometry.decompose(gl);
    }

    copy() {
        return {...super.copy(), ...this};
    }
}

export { Model };