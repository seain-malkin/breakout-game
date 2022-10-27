import { mat4 } from "gl-matrix";
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
}

export { PerspectiveCamera };