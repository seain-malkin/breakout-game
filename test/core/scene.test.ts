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
    expect(scene.models.length).toBe(1);
});