import { mat4 } from "gl-matrix";
import { Program, ProgramInput } from "../core/Program";
import { Camera } from "./Camera";

class PerspectiveCamera extends Camera {
    updateProjectionMatrix(): void {
        mat4.perspective(
            this._projectionMatrix,
            this._fov,
            this._aspect,
            this._near,
            this._far,
        );
    }

    draw(gl: WebGL2RenderingContext, program: Program): void {
        program.updateProperty(gl, ProgramInput.PROJECTION, this.projectionMatrix);
    }
}

export { PerspectiveCamera };