import { vec2 } from "gl-matrix";

type newtons = number;

interface Force {
    vector: vec2
}

class Movable {
    mass: newtons;
    velocity: vec2;
    forces = new Array<Force>();

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
        this.forces.filter((f) => f !== force);
    }
}

export {
    Movable,
    Force,
}