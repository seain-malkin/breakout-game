import { Scene } from '../../src/core/Scene';
import { Model } from '../../src/object/Model';
import { Plane } from '../../src/geometry/Plane';
import { Material } from '../../src/material/Material';

let scene: Scene;

beforeEach(() => {
    scene = new Scene();
});

test('Add Model', () => {
    const model = new Model(new Plane(0), new Material());
    const tag = "test_program";
    scene.addModel(tag, model);
    expect(scene.models).toContainEqual([tag, [model]]);
});

test('Add two models then remove one', () => {
    const model1 = new Model(new Plane(0), new Material());
    const model2 = new Model(new Plane(0), new Material());
    const tag = "test_program";
    scene.addModel(tag, model1);
    scene.addModel(tag, model2);
    expect(scene.models).toContainEqual([tag, [model1, model2]]);
    scene.removeModel(tag, model1);
    expect(scene.models).toContainEqual([tag, [model2]]);
});