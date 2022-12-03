import { vec3 } from "gl-matrix";
import { NetForce, Push, Resist, Force } from "../../src/core/Force";

describe(`Applying a Net Force to a Velocity`, () => {
    test(`Apply acceleration to velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force: Force = new Push([1.0, 0.0, 0.0],
            new NetForce());

        const postVel = force.applyForce(velocity, 1.0);

        expect(vec3.equals(postVel, [1.0, 0.0, 0.0])).toBe(true);
    });

    test(`Apply friction then acceleration to a velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force: Force = new Push([1.0, 1.0, 0.0], 
            new Resist([0.5, 0.0, 0.0], 
            new NetForce()));

        const postVel = force.applyForce(velocity, 0.1);

        expect(vec3.equals(postVel, [0.05, 0.1, 0.0])).toBe(true);
    });

    test(`Apply friction to a velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force: Force = new Resist([0.5, 0.8, 0.2],
            new NetForce());

        const postVel = force.applyForce(velocity, 1.0);

        expect(vec3.equals(postVel, [0.0, 0.0, 0.0])).toBe(true);
    });

    test(`Apply acceleration then friction to a velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force: Force = new Resist([0.5, 1.2, 1.0],
            new Push([0.75, 1.0, -2.0],
            new Push([0.1, 0.1, 0.1],
            new NetForce())));

        const postVel = force.applyForce(velocity, 1.0);

        expect(postVel[0]).toBeCloseTo(0.35);
        expect(postVel[1]).toBeCloseTo(0.0);
        expect(postVel[2]).toBeCloseTo(-0.9);
    });
    
});