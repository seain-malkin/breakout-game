import { Program, ProgramBuilder, ShaderResource } from "./Program";
import { Scene } from "./Scene";
import { Dimensions, getHtmlElementDimensions } from "./Util";

/**
 * Takes a list of programs and associates a list of models with each.
 * The renderers job is to draw each model with its associated program.
 */
class Renderer {
    readonly context: WebGL2RenderingContext;
    readonly canvasElement: HTMLCanvasElement;
    dimensions: Dimensions = { width: 800, height: 600 };

    private programs = new Array<[string, Program]>();

    constructor(canvasId: string) {
        this.canvasElement = this.getCanvasElement(canvasId);
        this.context = this.getCanvasContext(this.canvasElement);
    }

    render(scene: Scene, deltaTime: number) {
        const canvasDims = getHtmlElementDimensions(this.context.canvas);
        if (canvasDims.height !== this.dimensions.height) {
            this.dimensions = canvasDims;
            this.context.viewport(0, 0, canvasDims.width, canvasDims.height);
        }
        this.context.clearColor(0, 0, 0, 1);
        this.context.clearDepth(1.0);
        this.context.enable(this.context.DEPTH_TEST);
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        
        for (const [ tag, program ] of this.programs) {
            program.use(this.context);
            scene.camera.aspect = canvasDims.width / canvasDims.height;
            scene.camera.draw(this.context, program);
            for (const model of scene.getModels(tag)) {
                model.position = [0.0, 0.0, -6.0];
                model.draw(this.context, program);
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

        return builder.build(this.context)
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
            program.use(this.context);
            for (const model of scene.getModels(tag)) {
                model.compose(this.context, program);
            }
        }
    }

    /**
     * Gets the WebGL context from a canvas HTML element.
     * @param element The HTML canvas element object to extract the context
     * @returns A WebGL2 context
     */
    private getCanvasContext(element: HTMLCanvasElement): WebGL2RenderingContext {
        const context = element.getContext("webgl2");
        if (context == null) {
            throw new Error(`WebGL2 not supported by browser`);
        }

        return context;
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
}

export { Renderer };