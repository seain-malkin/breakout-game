import { Axis, Vector2D } from "../../src/core/Axis2D";

test(`Create a vector without specifying an initial value`, () => {
    const vector = new Vector2D();

    expect(vector.vector).toEqual(new Float32Array([0.0, 0.0]));
});

test(`Create a vector with an initial value`, () => {
    const value = new Float32Array([1.0, 2.0]);
    const vector = new Vector2D(value);

    expect(vector.vector).toEqual(value);
});

describe(`Shift vector along axes`, () => {

    test(`Shift randomly along both axes`, () => {
        let x = -234.0, y = 474.0;
        const v = new Vector2D([x, y]);

        for (let i = 0; i < 10; i++) {
            const rx = randomSignedInt();
            const ry = randomSignedInt();
            x += rx;
            y += ry;
            v.shift(rx, Axis.X);
            v.shift(ry, Axis.Y);
            expect(v.vector).toEqual(new Float32Array([x, y]));
        }
    });

    const randomSignedInt = (min = 0, max = 100) => {
        const int = Math.floor(Math.random() * (max - min) + min);
        const sign = Math.random() < 0.5 ? -1 : 1;
        return int * sign;
    };
});

test(`Reset a vector with a defined value`, () => {
    let x = 5, y = -10;
    const v = new Vector2D([x, y]);
    x = -3;
    y = 34;
    v.reset([x, y]);
    expect(v.vector).toEqual(new Float32Array([x, y]));
});

test(`Reset a vector with an undefined value`, () => {
    let x = 4, y = -10.0;
    const v = new Vector2D([x, y]);
    v.reset();
    expect(v.vector).toEqual(new Float32Array([0.0, 0.0]));
});

test(`Reset individual vector axes`, () => {
    let x = 5.0, y = -47.0;
    const v = new Vector2D([x, y]);
    v.reset(y, Axis.X);
    expect(v.vector).toEqual(new Float32Array([y, y]));
    v.reset(x, Axis.Y);
    expect(v.vector).toEqual(new Float32Array([y, x]));
});