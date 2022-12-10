import { mat4 } from "gl-matrix";

export interface Transformational<T> {
    /**
     * Returns the final transformation matrix.
     * @return Matrix with all three transformations
     */
    get transformation(): mat4;

    /**
     * Shifts a value by a given amount.
     * @param delta The amount of change to apply
     */
    translate(delta: T): void;

    /**
     * Changes the size of a value by a given amount.
     * @param factor The scaling factor to apply
     */
    scale(factor: number): void;

    /**
     * Reflects a value across the given dimensions. Assign a
     * value of -1 to the dimensions to reflect in.
     * @param dimension Dimensions to reflect 
     */
    reflect(dimension: T): void;
}