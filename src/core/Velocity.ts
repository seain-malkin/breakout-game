import { vec3 } from "gl-matrix";

interface DeltaVelocity {
    getVelocity(): vec3;
}

abstract class Force implements DeltaVelocity {
    protected force: Force;

    constructor(force: Force) {
        this.force = force;
    }

    abstract getVelocity(): vec3;
}

class Acceleration extends Force {

    constructor(force: Force) {
        super(force);
    }

    getVelocity(): vec3 {
        return this.force.getVelocity();
    }
}

class Drag extends Force {

    constructor(force: Force) {
        super(force);
    }

    getVelocity(): vec3 {
        return this.force.getVelocity();
    }
}

class Velocity implements DeltaVelocity {
    private vector: vec3;

    getVelocity(): vec3 {
        return this.vector;
    }
}