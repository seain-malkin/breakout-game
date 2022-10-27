import { Plane } from "../geometry/Plane";
import { Material } from "../material/Material";
import { Model } from "./Model";

class Brick extends Model {
    constructor() {
        super(new Plane(), new Material());
    }
}

export { Brick };