import { mat4, vec2, vec3 } from 'gl-matrix';

type ShaderResource = [ GLenum, string ];

type ProgramKey = number;

interface ProgramProperty<T extends number | WebGLUniformLocation> {
    name: string;
    type: GLenum;
    location: T;
}

enum ProgramInput {
    POSITION = 'a_position',
    RESOLUTION = 'u_resolution',
    VIEW = 'u_model',
    MODEL = 'u_local',
    PROJECTION = 'u_view',
    COLOR = 'u_color',
}

class Program {
    private static instances = 0;
    readonly id: ProgramKey = ++Program.instances;
    readonly attribs: ProgramProperty<number>[];
    readonly uniforms: ProgramProperty<WebGLUniformLocation>[];

    constructor(
        public gl: WebGL2RenderingContext,
        public glid: WebGLProgram,
        public name: string,
        attribs?: ProgramProperty<number>[],
        uniforms?: ProgramProperty<WebGLUniformLocation>[],
    ) {
        this.attribs = attribs || new Array<ProgramProperty<number>>();
        this.uniforms = uniforms || new Array<ProgramProperty<WebGLUniformLocation>>();
    }

    use(gl: WebGL2RenderingContext): void {
        gl.useProgram(this.glid);
    }

    getAttribute(name: string): ProgramProperty<number> {
        for (const attrib of this.attribs) {
            if (name === attrib.name) {
                return attrib;
            }
        }

        return null;
    }

    updateProperty(
        gl: WebGL2RenderingContext,
        name: string, 
        value: mat4 | vec3 | vec2
    ) {
        for (const property of this.uniforms) {
            if (property.name === name) {
                this.injectPropertyValue(gl, property, value);
                break;
            }
        }
    }

    private injectPropertyValue(
        gl: WebGL2RenderingContext,
        property: ProgramProperty<WebGLUniformLocation>, 
        value: mat4 | vec3 | vec2,
    ) {
        switch (property.type) {
            case gl.FLOAT_MAT4:
                gl.uniformMatrix4fv(property.location, false, value);
                break;
            case gl.FLOAT_VEC3:
                gl.uniform3fv(property.location, value);
                break;
            case gl.FLOAT_VEC2:
                gl.uniform2fv(property.location, value);
                break;
            default:
                throw new Error(`Property '${property.name}' with type '${property.type}' is not supported.`);
        }
    }
}

class ProgramBuilder {
    private shaders = new Array<ShaderResource>();

    constructor(public name: string) {}

    attachShader(source: ShaderResource): this {
        this.shaders.push(source);
        return this;
    }

    build(gl: WebGL2RenderingContext): Promise<Program> {
        return new Promise((resolve, reject) => {
            const glid = gl.createProgram();

            // Compile and attach each shader resource
            for (const [type, source] of this.shaders) {
                const shaderId = gl.createShader(type);
                gl.shaderSource(shaderId, source);
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
                resolve(new Program(gl, glid, this.name, getAttributes(glid), getUniforms(glid)));
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

export { ProgramBuilder, Program, ProgramKey, ShaderResource, ProgramInput };