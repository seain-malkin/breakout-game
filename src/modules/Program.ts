export { Program };

import { mat4 } from 'gl-matrix';

type Uniform = {
    name: string,
    location: WebGLUniformLocation,
};

type Attribute = {
    name: string,
    location: number,
};

abstract class Program {
    readonly glIndex: WebGLProgram;

    attributes: Attribute[];
    uniforms: Uniform[];

    constructor(
        public wgl: WebGL2RenderingContext,
        public vertexSource: string,
        public fragmentSource: string
    ) {
        this.glIndex = wgl.createProgram();
    }

    use() {
        this.wgl.useProgram(this.glIndex);
    }

    abstract defineAttributes(): void;
    abstract defineUniforms(): string[];

    build(): Promise<void> {
        return Promise.all([
            this.compileShader(this.vertexSource, this.wgl.VERTEX_SHADER),
            this.compileShader(this.fragmentSource, this.wgl.FRAGMENT_SHADER)
        ]).then((res) => {
            let [vertexShader, fragmentShader] = res;
            
            this.wgl.attachShader(this.glIndex, vertexShader);
            this.wgl.attachShader(this.glIndex, fragmentShader);
            this.wgl.linkProgram(this.glIndex);

            // Can delete shaders once linked
            this.wgl.deleteShader(vertexShader);
            this.wgl.deleteShader(fragmentShader);
            
            if (!this.wgl.getProgramParameter(this.glIndex, this.wgl.LINK_STATUS)) {
                return Promise.reject(this.wgl.getProgramInfoLog(this.glIndex));
            } else {
                return Promise.resolve();
            }
        });
    }

    private compileShader(source: string, type: GLenum): Promise<WebGLShader> {
        return new Promise((resolve, reject) => {
            const shader = this.wgl.createShader(type);
            this.wgl.shaderSource(shader, source);
            this.wgl.compileShader(shader);
        
            const success = this.wgl.getShaderParameter(shader, this.wgl.COMPILE_STATUS);
            if (!success) {
                const info = this.wgl.getShaderInfoLog(shader);
                this.wgl.deleteShader(shader);
                reject(info);
            } else {
                resolve(shader);
            }
        });
    }
}