import { BufferObject } from "./BufferObject";
import { GL_ELEMENT_ARRAY_BUFFER } from "webgl-constants";

class IndexBuffer extends BufferObject {
    constructor(
        data: ArrayBuffer,
        _usage?: GLenum
    ) {
        super(GL_ELEMENT_ARRAY_BUFFER, data, _usage);
    }
}

export { IndexBuffer };