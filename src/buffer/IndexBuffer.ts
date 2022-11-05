import { BufferObject } from "./BufferObject";
import { GL_ELEMENT_ARRAY_BUFFER, GL_TRIANGLES, GL_UNSIGNED_SHORT, } from "webgl-constants";
import { BufferComposable } from './buffer';

abstract class IndexBuffer 
extends BufferObject 
implements BufferComposable {
    abstract type: number;

    mode: GLenum = GL_TRIANGLES;
    
    constructor(
        data: ArrayBuffer,
        count: number,
        usage?: GLenum
    ) {
        super(GL_ELEMENT_ARRAY_BUFFER, data, count, usage);
    }

    get count(): number {
        return this._count;
    }
}

class Unit16IndexBuffer extends IndexBuffer {
    type = GL_UNSIGNED_SHORT;

    constructor(data: number[], usage?: GLenum) {
        super(new Uint16Array(data), data.length ,usage);
    }
}

export { IndexBuffer, Unit16IndexBuffer };