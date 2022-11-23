enum KeyState {
    Idle        = 0,
    Active      = 1 << 0,
    Down        = 1 << 1,
    Up          = 1 << 2,
}

let keys: Map<string, number>;

let target: HTMLElement;

const key = (key: string): KeyState => {
    if (!keys.has(key)) {
        keys.set(key, KeyState.Idle);
    }

    return keys.get(key);
};

const keyActive = (keyChar: string): boolean => {
    assertEnabled();

    return checkState(keyChar, KeyState.Active);
};

const keyDown = (keyChar: string): boolean => {
    assertEnabled();

    return checkState(keyChar, KeyState.Down, true);
};

const keyUp = (keyChar: string): boolean => {
    assertEnabled();

    const isUp = checkState(keyChar, KeyState.Up);

    // Set state back to Idle after key up observed
    if (isUp) {
        keys.set(keyChar, KeyState.Idle);
    }

    return isUp;
};

const checkState = (keyChar: string, check: KeyState, clear: boolean = false): boolean => {
    const state = key(keyChar);
    const hasState = (state & check) === check;

    // State can be removed on observation
    if (clear && hasState) {
        keys.set(keyChar, state ^ check);
    }

    return hasState;
};

const enable = (element: HTMLElement) => {
    // Disable any existing element events
    disable();

    // Overwrite any existing KeyState map
    keys = new Map();

    target = element;

    target.focus();

    target.onkeydown = (ev: KeyboardEvent) => {
        const state = key(ev.key);

        // Only set Down state if key is currently inactive
        if ((state & KeyState.Active) !== KeyState.Active) {
            keys.set(ev.key, KeyState.Down | KeyState.Active);
        }
    };

    target.onkeyup = (ev: KeyboardEvent) => {
        const state = key(ev.key);
        
        // Only set Up state if key is currently active
        if ((state & KeyState.Active) === KeyState.Active) {
            keys.set(ev.key, KeyState.Up);
        }
    };
};

const disable = () => {
    if (target) {
        target.onkeydown = null;
        target.onkeydown = null;

        target = null;
        keys = null;
    }
};

const assertEnabled = () => {
    if (!target) {
        throw new Error("KeyboardState must be enabled with a target before checking key state.");
    }
};

export default {
    enable,
    disable,
    keyActive,
    keyDown,
    keyUp,
};