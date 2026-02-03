// 入力管理
class InputManager {
    constructor() {
        this.keys = {};
        this.prevKeys = {};
        this.setup();
    }
    
    setup() {
        document.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            // ゲーム用キーはデフォルト動作を防ぐ
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyZ','KeyX','KeyC'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', e => {
            this.keys[e.code] = false;
        });
        
        window.addEventListener('blur', () => {
            this.keys = {};
        });
    }
    
    update() {
        this.prevKeys = { ...this.keys };
    }
    
    isDown(key) {
        return !!this.keys[key];
    }
    
    justPressed(key) {
        return this.keys[key] && !this.prevKeys[key];
    }
    
    justReleased(key) {
        return !this.keys[key] && this.prevKeys[key];
    }
    
    isUp() { return this.isDown('ArrowUp') || this.isDown('KeyW'); }
    isDownDir() { return this.isDown('ArrowDown') || this.isDown('KeyS'); }
    isLeft() { return this.isDown('ArrowLeft') || this.isDown('KeyA'); }
    isRight() { return this.isDown('ArrowRight') || this.isDown('KeyD'); }
    isConfirm() { return this.justPressed('KeyZ') || this.justPressed('Enter') || this.justPressed('Space'); }
    isCancel() { return this.justPressed('KeyX') || this.justPressed('Backspace'); }
    isMenu() { return this.justPressed('KeyC') || this.justPressed('Escape'); }
    
    anyMovement() {
        return this.isUp() || this.isDownDir() || this.isLeft() || this.isRight();
    }
    
    getMovement() {
        let dx = 0, dy = 0;
        if (this.isUp()) dy = -1;
        if (this.isDownDir()) dy = 1;
        if (this.isLeft()) dx = -1;
        if (this.isRight()) dx = 1;
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        return { x: dx, y: dy };
    }
}
