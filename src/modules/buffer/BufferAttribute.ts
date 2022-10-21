import { GL_FLOAT } from "webgl-constants";

class BufferAttribute {
    normalized = false;
    stride = 0;
    offset = 0;

    constructor(
        public size: number,
        normalized?: boolean,
        stride?: number,
        offset?: number,
    ) {
        if (normalized != null) {
            this.normalized = normalized;
        }

        if (stride != null) {
            this.stride = stride;
        }

        if (offset != null) {
            this.offset = offset;
        }
    }
    
    enable(gl: WebGL2RenderingContext, location: number, type: number) {
        gl.vertexAttribPointer(
            location, 
            this.size, 
            type,
            this.normalized,
            this.stride,
            this.offset,
        );
        gl.enableVertexAttribArray(location);
    }
}

export { BufferAttribute };