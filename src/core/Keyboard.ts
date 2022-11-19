type keyState = {
    down: boolean,
    held: boolean,
    up: boolean,
};

enum KeyState {
    Idle =   0,
    Down =   1 << 0,
    Up =     1 << 1,
    Repeat = 1 << 2,
}

/**
 * Represents the pressed state of individual keys from the
 * device keyboard.
 */
class Keyboard {
    private target: HTMLElement;
    
    private keys: Map<string, number>;
    
    constructor(element: HTMLElement) {
        this.target = element;
    }

    hasState(key: string, checkState: number): boolean {
        const keyState = this.requireKeyState(key);

        // Test the input state to the current state
        const match = (keyState & checkState) === checkState;

        return match;
    }

    enable() {
        this.keys = new Map();

        this.target.onkeydown = (event) => {
            let keyState = this.requireKeyState(event.key);

            // Remove any Up state
            keyState ^= KeyState.Up;

            // Apply current key state
            if (!event.repeat) {
                keyState |= KeyState.Down;
            } else {
                keyState |= KeyState.Repeat;
            }

            this.keys.set(event.key, keyState);
        };

        this.target.onkeyup = (event) => {
            this.requireKeyState(event.key);

            // Clear all states except the Up state
            this.keys.set(event.key, KeyState.Up);
        };
    }

    disable() {
        this.target.onkeydown = null;
        this.target.onkeyup = null;
    }

    private requireKeyState(key: string): number {
        if (!this.keys.has(key)) {
            this.keys.set(key, KeyState.Idle);
        }

        return this.keys.get(key);
    }
}

export { Keyboard, KeyState, };