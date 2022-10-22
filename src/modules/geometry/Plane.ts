import { BufferAttribute } from "../buffer/BufferAttribute";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { Unit16IndexBuffer } from "../buffer/IndexBuffer";
import { Float32VertexBuffer } from "../buffer/VertexBuffer";

class Plane extends GeometryBuffer {
    constructor(attribLoc: number) {
        super();
        const vertexBuffer = new Float32VertexBuffer(vertices);
        vertexBuffer.attachAttribute(attribLoc, new BufferAttribute(3));
        this.vertexBuffers.push(vertexBuffer);
        this.indexBuffer = new Unit16IndexBuffer(indices);
    }
}

const vertices = [
    // Bottom Left
    -0.5, -0.5, 0.0,
    // Top Left
    -0.5,  0.5, 0.0,
    // Top Right
     0.5,  0.5, 0.0,
    // Bottom Right
     0.5, -0.5, 0.0,
];

const indices = [
    0, 1, 2,
    0, 2, 3,
];

export { Plane };