export { MaterialProgram };

import { Program } from "./Program";
import vertexShader from './material.vs.glsl';
import fragmentShader from './material.fs.glsl';

class MaterialProgram extends Program {
    
    constructor(wgl: WebGL2RenderingContext) {
        super(wgl, vertexShader, fragmentShader);
    }

    defineAttributes(): void {
        this.attributes.push({
            name: 'aVertexPosition',
            location: this.wgl.getAttribLocation(this.glIndex, 'aVertexPosition'),
        });
    }

    defineUniforms(): string[] {
        return ['uModelViewMatrix', 'uProjectionMatrix', 'uColor'];
    }
}