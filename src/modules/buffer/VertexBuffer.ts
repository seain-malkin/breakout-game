import { BufferObject } from "./BufferObject";
import { BufferAttribute } from "./BufferAttribute";
import { GL_ARRAY_BUFFER } from "webgl-constants";

class VertexBuffer extends BufferObject {
    private attributes = new Array<[number, BufferAttribute]>();

    constructor(
        data: ArrayBuffer,
        _usage?: GLenum,
    ) {
        super(GL_ARRAY_BUFFER, data, _usage);
    }

    attachAttribute(location: number, attribute: BufferAttribute) {
        this.attributes.push([location, attribute]);
    }

    compose(gl: WebGL2RenderingContext): void {
        super.compose(gl);
        for (const [index, attrib] of this.attributes) {
            attrib.enable(gl, index);
        }
        gl.bindBuffer(this.target, null);
    }
}

export { VertexBuffer };