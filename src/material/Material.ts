import { BufferDrawable } from "../buffer/buffer";
import { Program } from "../core/Program";

abstract class Material implements BufferDrawable {
    abstract draw(gl: WebGL2RenderingContext, program: Program): void;

    abstract clone(): Material;
}

export { Material };