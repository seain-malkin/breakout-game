class BufferAttribute {
    normalized = false;
    stride = 0;
    offset = 0;

    constructor(
        public size: number,
        public type: number,
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
    
    enable(gl: WebGL2RenderingContext, location: number) {
        gl.vertexAttribPointer(
            location, 
            this.size, 
            this.type, 
            this.normalized, 
            this.stride, 
            this.offset
        );
        gl.enableVertexAttribArray(location);
    }
}

export { BufferAttribute };