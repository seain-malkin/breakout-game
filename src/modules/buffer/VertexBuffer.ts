import { BufferObject } from "./BufferObject";
import { BufferAttribute } from "./BufferAttribute";
import { GL_ARRAY_BUFFER, GL_FLOAT, } from "webgl-constants";
import { BufferComposable } from './buffer';

abstract class VertexBuffer 
extends BufferObject 
implements BufferComposable {
    abstract type: number;

    private attributes = new Array<[number, BufferAttribute]>();

    components: number = 0;

    constructor(
        data: ArrayBuffer,
        count: number,
        usage?: GLenum,
    ) {
        super(GL_ARRAY_BUFFER, data, count, usage);
    }

    attachAttribute(location: number, attribute: BufferAttribute) {
        this.attributes.push([location, attribute]);
    }

    compose(gl: WebGL2RenderingContext): void {
        super.compose(gl);
        for (const [index, attrib] of this.attributes) {
            attrib.enable(gl, index, this.type);
            this.components += attrib.size;
        }
        gl.bindBuffer(this.target, null);
    }

    get count(): number {
        if (this.components === 0) {
            return this.count;
        } else {
            return this._count / this.components;
        }
    }
}

class Float32VertexBuffer extends VertexBuffer {
    type = GL_FLOAT;

    constructor(
        data: number[],
        usage?: GLenum,
    ) {
        super(new Float32Array(data), data.length, usage);
    }
}

export { VertexBuffer, Float32VertexBuffer };