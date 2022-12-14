import { Scene } from '../../src/core/Scene';
import { Model } from '../../src/model/Model';
import { Brick } from '../../src/model/Brick';
import { BasicMaterial } from '../../src/material/BasicMaterial';

let scene: Scene;
let model: Model;
let material: BasicMaterial;

beforeEach(() => {
    scene = new Scene();
    material = new BasicMaterial([0.5, 0.5, 0.5]);
    model = new Brick(material);
});

test('Add a model', () => {
    const tag = "test_program";
    scene.addModel(tag, model);
    expect(scene.models).toContainEqual([tag, [model]]);
});

test('Add two models then remove one', () => {
    const model2 = new Brick(material);
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

test('Iterate over non-existent program', () => {
    let counter = 0;
    for (const model of scene.getModels("foo")) {
        counter++;
    }
    expect(counter).toBe(0);
});

test('Iterate over program with models', () => {
    const tag = "foo";
    const models = [ model, model, model, model ];
    scene.addModel(tag, models);
    let counter = 0;
    for (const model of scene.getModels(tag)) {
        counter++;
    }
    expect(counter).toBe(models.length);
});