import { BufferAttribute } from "../buffer/BufferAttribute";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { Unit16IndexBuffer } from "../buffer/IndexBuffer";
import { Float32VertexBuffer } from "../buffer/VertexBuffer";
import { ProgramInput } from "../core/Program";

class Plane extends GeometryBuffer {
    static instance: Plane;

    private constructor() {
        super();
        const vertexBuffer = new Float32VertexBuffer(vertices);
        vertexBuffer.attachAttribute(ProgramInput.POSITION, new BufferAttribute(2));
        this.vertexBuffers.push(vertexBuffer);
        this.indexBuffer = new Unit16IndexBuffer(indices);
    }

    static getInstance(): Plane {
        if (!Plane.instance) {
            Plane.instance = new Plane();
        }
        return Plane.instance;
    }
}

const vertices = [
    // Bottom Left
    -0.5, -0.5,
    // Top Left
    -0.5,  0.5,
    // Top Right
     0.5,  0.5,
    // Bottom Right
     0.5, -0.5,
];

const indices = [
    0, 1, 2,
    0, 2, 3,
];

export { Plane };