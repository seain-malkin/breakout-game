import { Program, ProgramBuilder, ShaderResource } from "./Program";
import { Scene } from "./Scene";

/**
 * Takes a list of programs and associates a list of models with each.
 * The renderers job is to draw each model with its associated program.
 */
class Renderer {
    readonly gl: WebGL2RenderingContext;
    readonly canvasElement: HTMLCanvasElement;

    private programs = new Array<[string, Program]>();

    constructor(canvasId: string) {
        this.canvasElement = this.getCanvasElement(canvasId);
        this.gl = this.getCanvasgl(this.canvasElement);
    }

    render(scene: Scene, deltaTime: number) {
        const resized = this.resizeCanvasToMatchDisplay();
        if (resized) {
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        }

        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        for (const [ tag, program ] of this.programs) {
            program.use(this.gl);
            scene.camera.aspect = this.gl.canvas.width / this.gl.canvas.height;
            scene.camera.draw(this.gl, program);
            for (const model of scene.getModels(tag)) {
                model.draw(this.gl, program);
            }
        }
    }

    /**
     * Creates a Shader Program asynchronously.
     * @param tag A name that identifies the program
     * @param shaders An array of shader GLSL source and type
     * @returns A tuple with the tag and created program wrapped in a promise
     */
    createProgram(tag: string, shaders: ShaderResource[]): Promise<[string, Program]> {
        const builder = new ProgramBuilder();
        for (const shader of shaders) {
            builder.attachShader(shader);
        }

        return builder.build(this.gl)
            .then((program) => {
                this.programs.push([tag, program]);
                return Promise.resolve([tag, program]);
            });
    }

    /**
     * Searches for the program registered with the given tag. If the
     * program doesn't exist, null is returned.
     * @param name Identifies the program used to draw the model
     */
    getProgram(name: string): Program | null {
        const [ _, program ] = this.programs.find(([tag, program]) => tag === name);
        if (!program) {
            return null;
        }

        return program;
    }

    /**
     * Loads the buffers of each model into graphics memory
     */
    compose(scene: Scene) {
        for (const [tag, program] of this.programs) {
            program.use(this.gl);
            for (const model of scene.getModels(tag)) {
                model.compose(this.gl, program);
            }
        }
    }

    /**
     * Gets the WebGL gl from a canvas HTML element.
     * @param element The HTML canvas element object to extract the gl
     * @returns A WebGL2 gl
     */
    private getCanvasgl(element: HTMLCanvasElement): WebGL2RenderingContext {
        const gl = element.getContext("webgl2");
        if (gl == null) {
            throw new Error(`WebGL2 not supported by browser`);
        }

        return gl;
    }

    /**
     * Finds the HTML canvas element with the given ID.
     * @param elementId The ID of the HTML canvas element
     * @returns A HTML canvas element object
     */
    private getCanvasElement(elementId: string): HTMLCanvasElement {
        const element = document.querySelector<HTMLCanvasElement>(`#${elementId}`);
        if (element == null) {
            throw new Error(`Can't find element ${elementId}`);
        }

        return element;
    }

    private resizeCanvasToMatchDisplay(): boolean {
        const canvas = this.gl.canvas;
        
        let updateDom = canvas.width !== canvas.clientWidth ||
                        canvas.height !== canvas.clientHeight;
        
        if (updateDom) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        return updateDom;
    }
}

export { Renderer };