import { GL_TRIANGLES } from "webgl-constants";
import { IndexBuffer } from "./IndexBuffer";
import { VertexBuffer } from "./VertexBuffer";

class GeometryBuffer {
    vao: WebGLVertexArrayObject;
    drawMode: GLenum = GL_TRIANGLES;
    vertexBuffers = new Array<VertexBuffer>();
    indexBuffer: IndexBuffer;
    
    compose(gl: WebGL2RenderingContext) {
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        for (const buffer of this.vertexBuffers) {
            buffer.compose(gl);
        }
        if (this.indexBuffer) {
            this.indexBuffer.compose(gl);
        }
        gl.bindVertexArray(null);
    }

    decompose(gl: WebGL2RenderingContext) {
        gl.bindVertexArray(null);
        for (const buffer of this.vertexBuffers) {
            buffer.decompose(gl);
        }
        if (this.indexBuffer) {
            this.indexBuffer.decompose(gl);
        }
        gl.deleteVertexArray(this.vao);
    }

    draw(gl: WebGL2RenderingContext) {
        gl.bindVertexArray(this.vao);
        if (this.indexBuffer) {
            const { count, type } = this.indexBuffer;
            gl.drawElements(this.drawMode, count, type, 0);
        } else {
            gl.drawArrays(this.drawMode, 0, this.vertexBuffers[0].count);
        }
    }
}


export { GeometryBuffer };