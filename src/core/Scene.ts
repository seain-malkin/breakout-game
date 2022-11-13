import { mat4 } from "gl-matrix";
import { BufferDrawable } from "../buffer/buffer";
import { Model } from "../model/Model";
import { SpaceMatrix } from "../model/SpaceMatrix";
import { Axis } from "./Axis2D";
import { Program, ProgramInput } from "./Program";
import { vec2ToVec3 } from "./Util";

class Scene implements BufferDrawable {
    readonly models = new Array<[string, Array<Model>]>();

    width = 400;
    height = 500;

    private projection: mat4;
    sceneSpace = new SpaceMatrix();

    onCanvasResize(canvas: {width: number, height: number}) {
        const scale = canvas.height / this.height;
        const origin = canvas.width / 2 / scale - this.width / 2;
        this.sceneSpace.scale.reset([scale, scale]);
        this.sceneSpace.position.reset(origin, Axis.X);
        this.updateProjection(canvas.width, canvas.height);
    }

    draw(gl: WebGL2RenderingContext, program: Program): void {
        program.updateProperty(gl, ProgramInput.PROJECTION, this.projection);
        for (const models of this.getModels(program.name)) {
            models.draw(gl, program);
        }
    }

    /**
     * Retrieve a list of models associated with a program.
     * @param tag Name of program models are associated with
     * @returns List of models for the given program
     */
    getModels(tag: string): Array<Model> {
        let index = this.findProgramModelArrayIndex(tag);
        if (index === -1) {
            return new Array<Model>();
        }
        const [ _, models ] = this.models[index];
        return models;
    }

    /**
     * Adds a model to the scene that will be rendered on the 
     * next draw iteration.
     * @param tag Identifies the program used to draw the model
     * @param model A model to be added to the rendered scene
     */
    addModel(tag: string, model: Model[] | Model) {
        const modelGroup = model instanceof Model ? [model] : model;
        let index = this.findProgramModelArrayIndex(tag);
        if (index === -1) {
            // First time program name encountered.
            const length = this.models.push([tag, new Array<Model>()]);
            index = length - 1;
        }
        for (const model of modelGroup) {
            const [ _, models ] = this.models[index];
            models.push(model);
        }
    }

    /**
     * Removes a model associated with a program from the scene.
     * @param tag Identifies the program used to draw the model
     * @param model The model(s) to be removed from the scene
     */
    removeModel(tag: string, model: Model[] | Model): void {
        const modelGroup = model instanceof Model ? [model] : model;
        let index = this.findProgramModelArrayIndex(tag);
        if (index === -1) return; // No program association

        for (const model of modelGroup) {
            const [ _, models ] = this.models[index];
            for (let i = 0; i < models.length; i++) {
                if (models[i] === model) {
                    models.splice(i, 1);
                    break;
                }
            }
        }
    }

    private updateProjection(width: number, height: number) {
        const projection = mat4.create();
        this.projection = mat4.create();
        mat4.ortho(projection, 0, width, 0, height, 0.0, 1.0);
        mat4.multiply(this.projection, projection, this.sceneSpace.matrix);
    }

    private findProgramModelArrayIndex(tag: string): number {
        return this.models.findIndex(([ key, _ ]) => key === tag);
    }
}

export { Scene };