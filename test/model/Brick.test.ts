import { BasicMaterial } from "../../src/material/BasicMaterial";
import { Brick } from "../../src/model/Brick";

test('Cloned Brick shares geometry but clones material', () => {
    const brick1 = new Brick(new BasicMaterial([0.5, 0.5, 0.5]));
    const brick2 = brick1.clone();

    expect(brick1).not.toEqual(brick2);
    expect(brick1.geometry).toEqual(brick2.geometry);
    expect(brick1.material).not.toEqual(brick2.material);
});