export { ProgramBuilder, IProgram };

import { mat4, vec3 } from 'gl-matrix';

type ShaderResource = {
    type: GLenum,
    source: string,
};

type AttributeOptions = {
    size: number,
    type: number,
    normalized?: boolean,
    stride?: number,
    offset?: number,
};

interface ProgramProperty<T extends number | WebGLUniformLocation> {
    name: string;
    type: GLenum;
    location: T;
}

interface IProgram {
    glid: WebGLProgram;
    attribs: ProgramProperty<number>[];
    uniforms: ProgramProperty<WebGLUniformLocation>[];

    updateProperty(name: string, value: mat4 | vec3): void;
    enableProperty(vao: WebGLVertexArrayObject, name: string, options: AttributeOptions): void;
}

class Program implements IProgram {
    attribs: ProgramProperty<number>[];
    uniforms: ProgramProperty<WebGLUniformLocation>[];

    constructor(
        public gl: WebGL2RenderingContext,
        public glid: WebGLProgram,
        attribs?: ProgramProperty<number>[],
        uniforms?: ProgramProperty<WebGLUniformLocation>[],
    ) {
        this.attribs = attribs || new Array<ProgramProperty<number>>();
        this.uniforms = uniforms || new Array<ProgramProperty<WebGLUniformLocation>>();
    }

    updateProperty(name: string, value: mat4 | vec3) {
        for (const property of this.uniforms) {
            if (property.name === name) {
                this.injectPropertyValue(property, value);
                break;
            }
        }
    }

    enableProperty(vao: WebGLVertexArrayObject, name: string, options: AttributeOptions) {
        for (const property of this.attribs) {
            if (property.name === name) {
                this.gl.bindVertexArray(vao);
                this.gl.vertexAttribPointer(
                    property.location, 
                    options.size,
                    options.type,
                    options.normalized != null ? options.normalized : false,
                    options.stride | 0,
                    options.offset | 0,
                );
                this.gl.enableVertexAttribArray(property.location);
                this.gl.bindVertexArray(null);
                break;
            }
        }
    }

    private injectPropertyValue(
        property: ProgramProperty<WebGLUniformLocation>, 
        value: mat4 | vec3,
    ) {
        switch (property.type) {
            case this.gl.FLOAT_MAT4:
                this.gl.uniformMatrix4fv(property.location, false, value);
                break;
            case this.gl.FLOAT_VEC3:
                this.gl.uniform3fv(property.location, value);
                break;
            default:
                throw new Error(`Property '${property.name}' with type '${property.type}' is not supported.`);
        }
    }
}

class ProgramBuilder {
    private shaders = new Array<ShaderResource>();

    attachShader(source: ShaderResource): this {
        this.shaders.push(source);
        return this;
    }

    build(gl: WebGL2RenderingContext): Promise<IProgram> {
        return new Promise((resolve, reject) => {
            const glid = gl.createProgram();

            // Compile and attach each shader resource
            for (const shader of this.shaders) {
                const shaderId = gl.createShader(shader.type);
                gl.shaderSource(shaderId, shader.source);
                gl.compileShader(shaderId);
                gl.attachShader(glid, shaderId);
            }

            gl.linkProgram(glid);

            // Shader resources can be deleted after program linked
            for (const shaderId of gl.getAttachedShaders(glid)) {
                gl.deleteShader(shaderId);
            }

            // Determine success of program linkage
            if (!gl.getProgramParameter(glid, gl.LINK_STATUS)) {
                reject(gl.getProgramInfoLog(glid));
            } else {
                resolve(new Program(gl, glid, getAttributes(glid), getUniforms(glid)));
            }

            /**
             * Retrieve attribute names and locations from the
             * compiled shaders.
             * @param glid WebGL Program resource index
             * @returns Array of Attributes found in shaders
             */
            function getAttributes(glid: WebGLProgram): ProgramProperty<number>[] {
                const attributes = new Array<ProgramProperty<number>>();
                const numActive = gl.getProgramParameter(glid, gl.ACTIVE_ATTRIBUTES);

                for (let i = 0; i < numActive; i++) {
                    const info = gl.getActiveAttrib(glid, i);
                    const loc = gl.getAttribLocation(glid, info.name);
                    attributes.push({
                        name: info.name, 
                        type: info.type, 
                        location: loc,
                    });
                }

                return attributes;
            }

            /**
             * Retrieve uniform names and locations from the
             * compiled shaders.
             * @param glid WebGL Program resource index
             * @returns Array of Uniforms found in shaders
             */
            function getUniforms(glid: WebGLProgram): ProgramProperty<WebGLUniformLocation>[] {
                const uniforms = new Array<ProgramProperty<WebGLUniformLocation>>();
                const numActive = gl.getProgramParameter(glid, gl.ACTIVE_UNIFORMS);

                for (let i = 0; i < numActive; i++) {
                    const info = gl.getActiveUniform(glid, i);
                    const loc = gl.getUniformLocation(glid, info.name);
                    uniforms.push({
                        name: info.name,
                        type: info.type,
                        location: loc,
                    });
                }

                return uniforms;
            }
        });
    }
}