import { ProgramBuilder, Program, ShaderResource, ProgramKey } from "./Program";
import { Model } from "../object/Model";

class Renderer {
    private _context: WebGL2RenderingContext;
    private canvasElement: HTMLCanvasElement;

    private programs: Record<string, Program>;
    private models: Record<ProgramKey, Model[]>;

    constructor(canvasId: string) {
        this.canvasElement = this.getCanvasElement(canvasId);
        this._context = this.getCanvasContext(this.canvasElement);
        
    }

    get context(): WebGL2RenderingContext {
        return this._context;
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

        if (!this.models[program.id]) {
            this.models[program.id] = new Array<Model>();
        }

        this.models[program.id].push(model);
    }

    createProgram(tag: string, shaders: ShaderResource[]): Promise<[string, Program]> {
        const builder = new ProgramBuilder();
        for (const shader of shaders) {
            builder.attachShader(shader);
        }

        return builder.build(this.context)
            .then((program) => {
                this.programs[tag] = program;
                return Promise.resolve([tag, program]);
            });
    }

    /**
     * Searches for the program registered with the given tag. If the
     * program doesn't exist, null is returned.
     * @param tag Identifies the program used to draw the model
     */
    getProgram(tag: string): Program | null {
        if (!this.programs[tag]) {
            return null;
        }

        return this.programs[tag];
    }

    private getCanvasContext(element: HTMLCanvasElement): WebGL2RenderingContext {
        const context = element.getContext("webgl2");
        if (context == null) {
            throw new Error(`WebGL2 not supported by browser`);
        }

        return context;
    }

    private getCanvasElement(elementId: string): HTMLCanvasElement {
        const element = document.querySelector<HTMLCanvasElement>(`#${elementId}`);
        if (element == null) {
            throw new Error(`Can't find element ${elementId}`);
        }

        return element;
    }
}

export { Renderer };