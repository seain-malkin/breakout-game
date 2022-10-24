import { ProgramBuilder, Program, ShaderResource, ProgramKey } from "./Program";
import { Model } from "../object/Model";

/**
 * Takes a list of programs and associates a list of models with each.
 * The renderers job is to draw each model with its associated program.
 */
class Renderer {
    readonly context: WebGL2RenderingContext;
    readonly canvasElement: HTMLCanvasElement;

    private programs = new Array<[string, Program]>();
    private models = new Array<[ProgramKey, Model[]]>();

    constructor(canvasId: string) {
        this.canvasElement = this.getCanvasElement(canvasId);
        this.context = this.getCanvasContext(this.canvasElement);
        
    }

    /**
     * Adds a model to the list of models to be drawn by a 
     * given program.
     * @param tag Identifies the program used to draw the model
     * @param model The model to draw
     */
    addModel(tag: string, model: Model) {
        const program = this.getProgram(tag);
        if (!program) {
            throw new Error(`Could not find a program with the tag '${tag}'.`);
        }

        // Search the models records for a program with the same id.
        const [ , models ] = this.models.find(([ key, ]) => key === program.id);

        models.push(model);
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
                this.models.push([program.id, new Array<Model>()]);
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
    composeBuffers() {
        for (const [ , models ] of this.models) {
            models.forEach((model) => {
                model.compose(this.context);
            });
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