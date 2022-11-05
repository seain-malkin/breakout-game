import { Axis } from "../core/Axis3D";
import { Plane } from "../geometry/Plane";
import { Material } from "../material/Material";
import { Model } from "./Model";

/**
 * Represents a game brick that can be destroyed when
 * hit by the ball.
 */
class Brick extends Model {
    margin = 0.1;

    constructor(material: Material) {
        super(Plane.getInstance(), material);
        this.scale.reset([1.0, 1.0, 1.0]);
    }

    clone(): Brick {
        const other = new Brick(this.material.clone());
        other.copy(this);
        return other;
    }

    copy(from: Brick) {
        super.copy(from);
    }
}

export { Brick };