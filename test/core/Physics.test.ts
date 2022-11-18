import { vec2 } from 'gl-matrix';
import { Physics, Movable, Force } from '../../src/core/Physics';

describe(`Physics Simulation`, () => {

    let movable: Movable;

    beforeEach(() => {
        movable = new Movable();
    });

    test(`Add singular force`, () => {
        movable.addForce({ vector: [1.0, 1.0] });

        expect(movable.forces.length === 1);
    });

    test(`Add array of forces`, () => {
        movable.addForce([
            { vector: [ 1.0, 1.0 ]},
            { vector: [ 2.0, 2.0 ]},
        ]);

        expect(movable.forces.length === 2);
    });

    test(`Singular force upon stationary object`, () => {
        const fixedDeltaTime = 0.01; // seconds
        const frames = 1 / fixedDeltaTime; // 100 frames/sec
        const force: Force = { vector: [1.5, -3.0] };
        
        movable.addForce(force);
        for (let i = 0; i < frames; i++) {
            Physics.simulate(movable, fixedDeltaTime);
        }
        
        expect(
            vec2.length(movable.velocity)
        ).toBeCloseTo(
            vec2.length(force.vector)
        );
    });

});