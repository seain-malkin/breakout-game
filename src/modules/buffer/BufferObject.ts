import { 
    GL_STATIC_DRAW, 
    GL_STATIC_COPY, 
    GL_STATIC_READ,
} from 'webgl-constants';

class BufferObject {
    private buffer: WebGLBuffer;

    constructor(
        public target: GLenum, 
        public data: ArrayBuffer,
        public _usage?: GLenum
    ) {
        if (_usage != null) {
            this.usage = _usage;
        }
    }

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

    compose(gl: WebGL2RenderingContext) {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(this.target, this.buffer);
        gl.bufferData(this.target, this.data, this.usage);
    }

    decompose(gl: WebGL2RenderingContext) {
        gl.deleteBuffer(this.buffer);
    }
}

export { BufferObject };