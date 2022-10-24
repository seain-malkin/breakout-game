import { 
    GL_STATIC_DRAW, 
    GL_STATIC_COPY, 
    GL_STATIC_READ,
} from 'webgl-constants';
import { BufferComposable } from './buffer';

abstract class BufferObject implements BufferComposable {
    abstract type: number;
    private buffer: WebGLBuffer;
    _usage: GLenum = GL_STATIC_DRAW;

    constructor(
        public target: GLenum, 
        public data: ArrayBuffer,
        public _count: number,
        usage?: GLenum,
    ) {
        if (usage != null) {  
            this.usage = usage;
        }
    }

    abstract get count(): number;

    set usage(value: GLenum) {
        switch (value) {
            case GL_STATIC_DRAW:
            case GL_STATIC_COPY:
            case GL_STATIC_READ:
                this._usage = value;
                break;
            default:
                throw new Error(`Buffer usage '${value}' is not supported.`);
        }
    }

    get usage() {
        return this._usage;
    }

    compose(gl: WebGL2RenderingContext) {
        // Since a buffer is shared amongst models it might already be composed
        if (this.buffer) return;

        this.buffer = gl.createBuffer();
        gl.bindBuffer(this.target, this.buffer);
        gl.bufferData(this.target, this.data, this.usage);
    }

    decompose(gl: WebGL2RenderingContext) {
        gl.deleteBuffer(this.buffer);
        this.buffer = undefined;
    }
}

export { BufferObject };