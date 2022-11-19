import { vec2 } from 'gl-matrix';
import { Physics, Movable, Force, Acceleration } from '../../src/core/Physics';

describe(`Physics Simulation`, () => {

    let movable: Movable;

    beforeEach(() => {
        movable = new Movable();
    });

    test(`Add singular force`, () => {
        movable.addForce(new Acceleration([1.0, 1.0]));

        expect(movable.forces.length === 1);
    });

    test(`Add array of forces`, () => {
        movable.addForce([
            new Acceleration([1.0, 1.0]),
            new Acceleration([ 2.0, 2.0 ]),
        ]);

        expect(movable.forces.length === 2);
    });

    test(`Singular force upon stationary object`, () => {
        const fixedDeltaTime = 0.01; // seconds
        const frames = 1 / fixedDeltaTime; // 100 frames/sec
        const force: Force = new Acceleration([1.5, -3.0]);
        
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