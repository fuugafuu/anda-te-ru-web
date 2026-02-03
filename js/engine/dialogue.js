// ダイアログシステム
class DialogueSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.queue = [];
        this.currentText = '';
        this.displayedText = '';
        this.charIndex = 0;
        this.typing = false;
        this.callback = null;
        this.setFlag = null;
        
        this.el = document.getElementById('dialog');
        this.textEl = document.getElementById('dialog-text');
        this.faceEl = document.getElementById('dialog-face');
    }
    
    show(dialogueId, callback = null) {
        const dialogue = DIALOGUES[dialogueId];
        if (!dialogue) {
            console.error('Dialogue not found:', dialogueId);
            if (callback) callback();
            return;
        }
        
        this.showTexts(dialogue.texts, () => {
            if (dialogue.setFlag) {
                this.game.flags[dialogue.setFlag] = true;
            }
            if (callback) callback();
        });
    }
    
    showTexts(texts, callback = null) {
        this.queue = [...texts];
        this.callback = callback;
        this.active = true;
        this.el.classList.add('active');
        this.next();
    }
    
    showText(text, callback = null) {
        this.showTexts([text], callback);
    }
    
    next() {
        if (this.queue.length === 0) {
            this.close();
            return;
        }
        
        this.currentText = this.queue.shift();
        this.displayedText = '';
        this.charIndex = 0;
        this.typing = true;
        this.textEl.innerHTML = '';
        
        this.typeChar();
    }
    
    typeChar() {
        if (!this.typing) return;
        
        if (this.charIndex >= this.currentText.length) {
            this.typing = false;
            return;
        }
        
        const char = this.currentText[this.charIndex];
        if (char === '\n') {
            this.displayedText += '<br>';
        } else {
            this.displayedText += char;
        }
        this.textEl.innerHTML = this.displayedText;
        this.charIndex++;
        
        // タイピング音（省略）
        
        // 次の文字
        let delay = 30;
        if ('。！？.!?'.includes(char)) delay = 150;
        else if ('、,'.includes(char)) delay = 80;
        
        setTimeout(() => this.typeChar(), delay);
    }
    
    advance() {
        if (!this.active) return;
        
        if (this.typing) {
            // スキップ
            this.typing = false;
            this.displayedText = this.currentText.replace(/\n/g, '<br>');
            this.textEl.innerHTML = this.displayedText;
        } else {
            this.next();
        }
    }
    
    close() {
        this.active = false;
        this.el.classList.remove('active');
        this.textEl.innerHTML = '';
        
        if (this.callback) {
            const cb = this.callback;
            this.callback = null;
            cb();
        }
    }
    
    setFace(sprite) {
        if (sprite) {
            this.faceEl.textContent = sprite;
            this.faceEl.classList.add('active');
        } else {
            this.faceEl.classList.remove('active');
        }
    }
}
