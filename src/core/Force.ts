import { vec3 } from "gl-matrix";

interface Net {
    net(velocity: vec3): vec3;
}

class Static implements Net {
    net(velocity: vec3): vec3 {
        return velocity;
    }
}

abstract class Applied implements Net {

    protected force: Net;

    constructor(force: Net) {
        this.force = force;
    }

    /**
     * Applies forces to the given velocity relative to a delta time.
     * @param velocity The velocity to add the force vector quantity to.
     * @param dt The time in seconds since the last application of force.
     */
    abstract net(velocity: vec3): vec3;
}

abstract class VectorQuantity extends Applied {

    /** Vector Quantity in 3D space */
    private quantity: vec3;

    constructor(qty: vec3, force: Net) {
        super(force);
        this.quantity = qty;
    }

    protected applyQuantity(a: vec3): vec3 {
        return vec3.add(vec3.create(), a, this.quantity);
    }
}

abstract class ScalarQuantity extends Applied {

    private quantity: number;

    constructor(qty: number, force: Net) {
        super(force);
        this.quantity = qty;
    }

    protected applyQuantity(a: vec3): vec3 {
        return vec3.scale(vec3.create(), a, this.quantity);
    }
}

class Push extends VectorQuantity {

    net(velocity: vec3): vec3 {
        return this.force.net(this.applyQuantity(velocity));
    }
}

class Resist extends ScalarQuantity {

    net(velocity: vec3): vec3 {
        const preFriction = this.force.net(velocity);
        const friction = this.applyQuantity(vec3.create());

        return vec3.fromValues(
            this.findMaxFriction(preFriction[0], friction[0]),
            this.findMaxFriction(preFriction[1], friction[1]),
            this.findMaxFriction(preFriction[2], friction[2]),
        );
    }

    private findMaxFriction(velocity: number, friction: number): number {
        const max = Math.max(0, Math.abs(velocity) - friction);
        return velocity < 0 ? max * -1 : max;
    }
}

export {
    Static as StaticForce,
    Net as NetForce,
    Push as PushForce,
    Resist as ResistForce,
}