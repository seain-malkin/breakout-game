import { BufferObject } from "./BufferObject";
import { GL_ELEMENT_ARRAY_BUFFER, GL_UNSIGNED_INT, GL_TRIANGLES, } from "webgl-constants";

abstract class IndexBuffer extends BufferObject {
    abstract type: number;

    mode: GLenum = GL_TRIANGLES;
    
    constructor(
        data: ArrayBuffer,
        usage?: GLenum
    ) {
        super(GL_ELEMENT_ARRAY_BUFFER, data, usage);
    }
}

class Unit16IndexBuffer extends IndexBuffer {
    type = GL_UNSIGNED_INT;

    constructor(data: number[], usage?: GLenum) {
        super(new Uint16Array(data), usage);
    }
}

export { Unit16IndexBuffer };