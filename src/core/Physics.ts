import { vec2 } from "gl-matrix";
import { WorldModel } from "../model/WorldModel";

type kg = number;
type seconds = number;
interface Force {
    vector: vec2;

    apply(target: Movable, deltaTime: seconds): void;
}

class Acceleration implements Force {
    vector: vec2;

    constructor(force: vec2) {
        this.vector = force;
    }

    apply(target: Movable, deltaTime: seconds) {
        const deltaForce = vec2.create();
        vec2.scale(deltaForce, this.vector, deltaTime / target.mass);
        const velocity = vec2.create();
        vec2.add(velocity, target.velocity, deltaForce);
        target.velocity = velocity;
    }
}

class Physics {

    private constructor() {};

    static fixedDeltaTime = 0.016;

    static simulate(movable: Movable, deltaTime: number) {
        movable.step(deltaTime);
    }
}

class Movable {
    mass: kg = 1.0;
    velocity = vec2.create();
    forces = new Array<Force>();

    constructor(public model: WorldModel) {}

    /**
     * Applies all the forces proportionally based on time passed.
     * @param deltaTime Time in seconds since last step.
     */
    step(deltaTime: seconds) {
        for (const force of this.forces) {
            force.apply(this, deltaTime);
        }
        
        const position = vec2.create();
        vec2.add(position, this.velocity, this.model.worldSpace.position.vector);
        this.model.worldSpace.position.reset(position);
    }

    /**
     * Adds a force to an object that will change the 
     * objects velocity vector over time.
     * @param force A force to apply to an object
     */
    addForce(force: Force | Array<Force>) {
        if (force instanceof Array<Force>) {
            this.forces.push(...force);
        } else {
            this.forces.push(force);
        }
    }

    /**
     * Removes a force from an object.
     * @param force The force to remove from an object.
     */
    removeForce(force: Force) {
        this.forces = this.forces.filter((f) => f !== force);
    }
}

export {
    Physics,
    Movable,
    Force,
    Acceleration,
}