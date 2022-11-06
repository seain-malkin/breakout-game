import { vec2, vec3 } from 'gl-matrix';
import { Vector2D } from './Axis2D';

function vec2ToVec3(vec: Vector2D | vec2, z: number = -0.0): vec3 {
    const v = vec instanceof Vector2D ? vec.vector : vec;
    return vec3.fromValues(v[0], v[1], z);
}

export { vec2ToVec3 }