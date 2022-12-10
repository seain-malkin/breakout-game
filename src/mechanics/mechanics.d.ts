declare namespace Mechanics {
    
    interface Size {
        width: number;
        height: number;
    }

    interface ValueConstraint<T> {
        constrain(value: T): T;
    }

    interface MinMaxConstraint<T> extends ValueConstraint<T> {
        min: T;
        max: T;
    }
}