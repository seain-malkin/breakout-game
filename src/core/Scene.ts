import { Camera } from "../camera/Camera";
import { Model } from "../object/Model";

class Scene {
    readonly models = new Array<[string, Array<Model>]>();

    constructor(public camera: Camera) {}

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

    private findProgramModelArrayIndex(tag: string): number {
        return this.models.findIndex(([ key, _ ]) => key === tag);
    }
}

export { Scene };