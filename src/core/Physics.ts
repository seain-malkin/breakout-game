import { vec2 } from "gl-matrix";

type newtons = number;
type Force = {
    vector: vec2;
};

class Physics {

    static fixedDeltaTime = 0.016;

    static simulate(movable: Movable, deltaTime: number) {
        for (const force of movable.forces) {
            const deltaForce = vec2.create();
            vec2.scale(deltaForce, force.vector, deltaTime);
            vec2.add(movable.velocity, movable.velocity, deltaForce);
        }
    }

}

class Movable {
    mass: newtons;
    velocity = vec2.create();
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
        this.forces = this.forces.filter((f) => f !== force);
    }
}

export {
    Physics,
    Movable,
    Force,
}