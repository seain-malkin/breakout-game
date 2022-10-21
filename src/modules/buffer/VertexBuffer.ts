import { BufferObject } from "./BufferObject";
import { BufferAttribute } from "./BufferAttribute";
import { GL_ARRAY_BUFFER, GL_FLOAT, } from "webgl-constants";

abstract class VertexBuffer extends BufferObject {
    abstract type: number;

    private attributes = new Array<[number, BufferAttribute]>();

    constructor(
        data: ArrayBuffer,
        usage?: GLenum,
    ) {
        super(GL_ARRAY_BUFFER, data, usage);
    }

    attachAttribute(location: number, attribute: BufferAttribute) {
        this.attributes.push([location, attribute]);
    }

    compose(gl: WebGL2RenderingContext): void {
        super.compose(gl);
        for (const [index, attrib] of this.attributes) {
            attrib.enable(gl, index, this.type);
        }
        gl.bindBuffer(this.target, null);
    }
}

class Float32VertexBuffer extends VertexBuffer {
    type = GL_FLOAT;

    constructor(
        data: number[],
        usage?: GLenum,
    ) {
        super(new Float32Array(data), usage);
    }
}

export { VertexBuffer, Float32VertexBuffer };