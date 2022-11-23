/**
 * @jest-environment jsdom
 */

import keystate from '../../src/core/KeyState';

describe(`Keystate keyboard input`, () => {

    let target: HTMLElement;
    const keyDownEvent = new KeyboardEvent('keydown', { key: 'j' });
    const keyUpEvent = new KeyboardEvent('keyup', { key: 'j' });

    beforeEach(() => {
        target = document.createElement('canvas');
        target.setAttribute('tabindex', '-1');
        target.setAttribute('autofocus', 'true');
        target.focus();
        keystate.enable(target);
    });

    test('Trigger Keydown event and check state', () => {
        expect(keystate.keyDown('j')).toBe(false);

        target.dispatchEvent(keyDownEvent);

        expect(keystate.keyDown('j')).toBe(true);
        expect(keystate.keyActive('j')).toBe(true);
        expect(keystate.keyDown('j')).toBe(false);
    });

    test(`Trigger keydown twice then keyup`, () => {
        target.dispatchEvent(keyDownEvent);
        expect(keystate.keyDown('j')).toBe(true);
        expect(keystate.keyActive('j')).toBe(true);
        
        target.dispatchEvent(keyDownEvent);
        expect(keystate.keyDown('j')).toBe(false);
        expect(keystate.keyActive('j')).toBe(true);

        target.dispatchEvent(keyUpEvent);
        expect(keystate.keyDown('j')).toBe(false);
        expect(keystate.keyUp('j')).toBe(true);
        expect(keystate.keyActive('j')).toBe(false);
        expect(keystate.keyUp('j')).toBe(false);
    });
});