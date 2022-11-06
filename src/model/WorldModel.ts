import { BufferDrawable } from "../buffer/buffer";
import { Program, ProgramInput } from "../core/Program";
import { SpaceMatrix } from "./SpaceMatrix";

abstract class WorldModel implements BufferDrawable {
    worldSpace = new SpaceMatrix();
    
    draw(gl: WebGL2RenderingContext, program: Program) {
        program.updateProperty(gl, ProgramInput.VIEW, this.worldSpace.matrix);
    }

    copy(from: WorldModel) {
        this.worldSpace = from.worldSpace.clone();
    }
}

export { WorldModel };