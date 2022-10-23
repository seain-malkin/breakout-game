import { WorldObject } from "./WorldObject";
import { Program } from "../core/Program";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { Material } from "../material/Material";

class Model extends WorldObject {
    constructor(public geometry: GeometryBuffer, public material: Material) {
        super();
    }

    draw(gl: WebGL2RenderingContext, program: Program) {
        program.use(gl);
        program.updateProperty(gl, 'modelView', this.modelView);
        program.updateProperty(gl, 'color', this.material.color);
        this.geometry.draw(gl);
    }

    copy() {
        return {...super.copy(), ...this};
    }
}

export { Model };