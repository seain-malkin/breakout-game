import { Plane } from "../geometry/Plane";
import { Material } from "../material/Material";
import { Model } from "./Model";

class Brick extends Model {
    constructor(material: Material) {
        super(Plane.getInstance(), material);
    }

    clone(): Brick {
        const other = new Brick(this.material);
        other.copy(this);
        return other;
    }

    copy(from: Brick) {
        super.copy(from);
    }
}

export { Brick };