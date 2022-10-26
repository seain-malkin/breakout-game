import { Scene } from '../../src/core/Scene';
import { Model } from '../../src/object/Model';
import { Plane } from '../../src/geometry/Plane';
import { Material } from '../../src/material/Material';

let scene: Scene;
let model: Model;

beforeEach(() => {
    scene = new Scene();
    model = new Model(new Plane(0), new Material());
});

test('Add a model', () => {
    const tag = "test_program";
    scene.addModel(tag, model);
    expect(scene.models).toContainEqual([tag, [model]]);
});

test('Add two models then remove one', () => {
    const model2 = new Model(new Plane(0), new Material());
    const tag = "test_program";
    scene.addModel(tag, model);
    scene.addModel(tag, model2);
    expect(scene.models).toContainEqual([tag, [model, model2]]);
    scene.removeModel(tag, model);
    expect(scene.models).toContainEqual([tag, [model2]]);
});

test('Add a model with different programs', () => {
    const tag1 = "foo";
    const tag2 = "bar";
    scene.addModel(tag1, model);
    scene.addModel(tag2, model);
    expect(scene.models.length).toBe(2);
    expect(scene.models).toContainEqual([tag1, [model]]);
    expect(scene.models).toContainEqual([tag2, [model]]);
});

test('Add and remove an array of models', () => {
    const models = [model, model, model, model];
    const tag = "foo";
    scene.addModel(tag, models);
    expect(scene.models).toContainEqual([tag, models]);
    scene.removeModel(tag, models);
    expect(scene.models).toContainEqual([tag, []]);
});

test('Remove a non existent model', () => {
    const tag = "foo";
    scene.removeModel(tag, model);
    expect(scene.models.length).toBe(0);
});