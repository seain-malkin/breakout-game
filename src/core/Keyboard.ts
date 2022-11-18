type KeyState = {
    pressed: boolean,
    repeating: boolean,
};

/**
 * Represents the pressed state of individual keys from the
 * device keyboard.
 */
class Keyboard {
    private target: HTMLElement;
    
    private keys: Map<string, KeyState>;
    
    constructor(element: HTMLElement) {
        this.target = element;
    }

    getKeyState(key: string): KeyState {
        return this.keys.has(key) ? this.keys.get(key) : {
            pressed: false,
            repeating: false,
        };
    }

    enable() {
        this.keys = new Map();

        this.target.onkeydown = (event) => {
            const key = this.requireKeyState(event.key);
            key.pressed = true;
            key.repeating = event.repeat;
        };

        this.target.onkeyup = (event) => {
            const key = this.requireKeyState(event.key);
            key.pressed = false;
            key.repeating = false;
        };
    }

    disable() {
        this.target.onkeydown = null;
        this.target.onkeyup = null;
    }

    private requireKeyState(key: string): KeyState {
        if (!this.keys.has(key)) {
            this.keys.set(key, {
                pressed: false,
                repeating: false,
            });
        }

        return this.keys.get(key);
    }
}

export { Keyboard };