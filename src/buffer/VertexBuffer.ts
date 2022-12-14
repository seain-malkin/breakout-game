/// <reference path="./buffer.d.ts" />
import { BufferObject } from "./BufferObject";
import { BufferAttribute } from "./BufferAttribute";
import { GL_ARRAY_BUFFER, GL_FLOAT, } from "webgl-constants";
import { BufferComposable } from './buffer';
import { Program, ProgramInput } from "../core/Program";

abstract class VertexBuffer 
extends BufferObject 
implements BufferComposable {
    abstract type: number;

    private attributes = new Array<[ProgramInput, BufferAttribute]>();

    components: number = 0;

    constructor(
        data: ArrayBuffer,
        count: number,
        usage?: GLenum,
    ) {
        super(GL_ARRAY_BUFFER, data, count, usage);
    }

    attachAttribute(input: ProgramInput, attribute: BufferAttribute) {
        this.attributes.push([input, attribute]);
    }

    compose(gl: WebGL2RenderingContext, program: Program): void {
        super.compose(gl, program);
        for (const [key, attrib] of this.attributes) {
            attrib.enable(gl, program.getAttribute(key).location, this.type);
            this.components += attrib.size;
        }
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