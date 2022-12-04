import { vec3 } from "gl-matrix";
import { NetForce, PushForce, ResistForce, StaticForce } from "../../src/core/Force";

describe(`Applying a Net Force to a Velocity`, () => {
    test(`Apply acceleration to velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force: NetForce = new PushForce([1.0, 0.0, 0.0],
            new StaticForce());

        const postVel = force.net(velocity);

        expect(vec3.equals(postVel, [1.0, 0.0, 0.0])).toBe(true);
    });

    test(`Apply friction then acceleration to a velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force: NetForce = new PushForce([1.0, 1.0, 0.0], 
            new ResistForce([0.5, 0.0, 0.0], 
            new StaticForce()));

        const postVel = force.net(velocity);

        expect(vec3.equals(postVel, [0.5, 1.0, 0.0])).toBe(true);
    });

    test(`Apply friction to a velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force: NetForce = new ResistForce([0.5, 0.8, 0.2],
            new StaticForce());

        const postVel = force.net(velocity);

        expect(vec3.equals(postVel, [0.0, 0.0, 0.0])).toBe(true);
    });

    test(`Apply acceleration then friction to a velocity`, () => {
        const velocity = vec3.fromValues(0.0, 0.0, 0.0);
        const force: NetForce = new ResistForce([0.5, 1.2, 1.0],
            new PushForce([0.75, 1.0, -2.0],
            new PushForce([0.1, 0.1, 0.1],
            new StaticForce())));

        const postVel = force.net(velocity);

        expect(postVel[0]).toBeCloseTo(0.35);
        expect(postVel[1]).toBeCloseTo(0.0);
        expect(postVel[2]).toBeCloseTo(-0.9);
    });
    
});