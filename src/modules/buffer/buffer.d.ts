import { Program } from "../core/Program";

declare interface BufferComposable {
    compose(gl: WebGL2RenderingContext): void;
    decompose(gl: WebGL2RenderingContext): void;
}

declare interface BufferDrawable {
    draw(gl: WebGL2RenderingContext, program?: Program): void;
}

export { BufferComposable, BufferDrawable };