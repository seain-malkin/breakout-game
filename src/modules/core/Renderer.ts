import { ProgramBuilder, Program, ShaderResource } from "./Program";

class Renderer {
    private _context: WebGL2RenderingContext;
    private canvasElement: HTMLCanvasElement;

    private programs = new Array<[string, Program]>();
    

    constructor(canvasId: string) {
        this.canvasElement = this.getCanvasElement(canvasId);
        this._context = this.getCanvasContext(this.canvasElement);
        
    }

    get context(): WebGL2RenderingContext {
        return this._context;
    }

    createProgram(tag: string, shaders: ShaderResource[]): Promise<Program> {
        const builder = new ProgramBuilder();
        for (const shader of shaders) {
            builder.attachShader(shader);
        }

        return builder.build(this.context)
            .then((program) => {
                this.programs.push([tag, program]);
                return Promise.resolve(program);
            })
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