export enum Key {
    Up = "arrowup",
    Down = "arrowdown",
    Left = "arrowleft",
    Right = "arrowright",
    Space1 = "space",
    Space2 = " ",
    Shift = "shift",
    W = "w",
    A = "a",
    S = "s",
    D = "d",
    R = "r",
    P = "p",
}

type KeyMap = Map<string[], () => void>

export default class KeyHandler {
    constructor(
        private keymap: KeyMap = new Map(),
        private pressedKeys: Array<string> = []
    ) { }

    static createKeyHandler(keymap: KeyMap): KeyHandler {
        let handler = new KeyHandler(keymap, []);
        return handler;
    }

    setupKeyListeners(): this {
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));
        return this;
    }

    // Helper functions for key events
    handleKeyDown(event: KeyboardEvent) {
        if (!this.pressedKeys.includes(event.key.toLowerCase())) {
            this.pressedKeys.push(event.key.toLowerCase());
        }

        this.checkKeys();
    }

    handleKeyUp(event: KeyboardEvent) {
        // Remove the released key from the array
        const index = this.pressedKeys.indexOf(event.key.toLowerCase());
        if (index !== -1) {
            this.pressedKeys.splice(index, 1);
        }

        // Check if multiple keys are still being held down
        this.checkKeys();
    }

    checkKeys(this: KeyHandler) {
        for (let j = 0; j < this.keymap.size; j++) {
            const [keys, action] = Array.from(this.keymap.entries())[j];
            for (let k = 0; k < keys.length; k++) {
                if (this.pressedKeys.includes(keys[k])) {
                    action();
                }
            }
        }

        console.log("Keys: " + this.keymap);
    }
}