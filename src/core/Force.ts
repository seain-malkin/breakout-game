import { vec3 } from "gl-matrix";

interface ForceComponent {
    applyForce(velocity: vec3, dt: number): vec3;
}

class NetForce implements ForceComponent {
    applyForce(velocity: vec3, dt: number): vec3 {
        return velocity;
    }
}

abstract class AppliedForce implements ForceComponent {

    protected force: ForceComponent;

    /** Vector Quantity in 3D space */
    private quantity: vec3;

    constructor(qty: vec3, force: ForceComponent) {
        this.quantity = qty;
        this.force = force;
    }

    /**
     * Applies forces to the given velocity relative to a delta time.
     * @param velocity The velocity to add the force vector quantity to.
     * @param dt The time in seconds since the last application of force.
     */
    abstract applyForce(velocity: vec3, dt: number): vec3;

    protected addScaledQuantity(a: vec3, dt: number): vec3 {
        return vec3.scaleAndAdd(vec3.create(), a, this.quantity, dt);
    }
}

class Acceleration extends AppliedForce {

    applyForce(velocity: vec3, dt: number): vec3 {
        return this.force.applyForce(this.addScaledQuantity(velocity, dt), dt);
    }
}

class Friction extends AppliedForce {

    applyForce(velocity: vec3, dt: number): vec3 {
        const preFriction = this.force.applyForce(velocity, dt);
        const friction = this.addScaledQuantity(vec3.create(), dt);

        return vec3.fromValues(
            this.findMaxFriction(preFriction[0], friction[0]),
            this.findMaxFriction(preFriction[1], friction[1]),
            this.findMaxFriction(preFriction[2], friction[2])
        );
    }

    private findMaxFriction(velocity: number, friction: number): number {
        const max = Math.max(0, Math.abs(velocity) - friction);
        return velocity < 0 ? max * -1 : max;
    }
}

class Gravity extends AppliedForce {

    applyForce(velocity: vec3, dt: number): vec3 {
        return this.force.applyForce(this.addScaledQuantity(velocity, dt), dt);
    }
}

export {
    NetForce,
    Acceleration,
    Friction,
    Gravity,
}