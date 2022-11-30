import { vec3 } from "gl-matrix";
import { NetForce, Acceleration, Friction } from "../../src/core/Force";

describe(`Applying a Net Force to a Velocity`, () => {
    test(`Apply acceleration to velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const netForce = new NetForce();
        const acceleration = new Acceleration([1.0, 0.0, 0.0], netForce);

        const postVel = acceleration.applyForce(velocity, 1.0);

        expect(vec3.equals(postVel, [1.0, 0.0, 0.0])).toBe(true);
    });

    test(`Apply friction then acceleration to a velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force = new Acceleration([1.0, 1.0, 0.0], 
                      new Friction([0.5, 0.0, 0.0], 
                      new NetForce()));

        const postVel = force.applyForce(velocity, 1.0);

        expect(vec3.equals(postVel, [0.5, 1.0, 0.0])).toBe(true);
    });

    test(`Apply friction to a velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force = new Friction([0.5, 0.8, 0.2],
                      new NetForce());

        const postVel = force.applyForce(velocity, 1.0);

        expect(vec3.equals(postVel, [0.0, 0.0, 0.0])).toBe(true);
    });

    test(`Apply acceleration then friction to a velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force = new Friction([0.5, 1.2, 1.0],
                      new Acceleration([0.75, 1.0, -2.0],
                      new NetForce()));

        const postVel = force.applyForce(velocity, 1.0);

        expect(vec3.equals(postVel, [0.25, 0.0, -1.0])).toBe(true);
    });
    
});