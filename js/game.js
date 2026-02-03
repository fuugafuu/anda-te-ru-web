// メインゲームクラス
class Game {
    constructor() {
        this.state = GAME_STATE.TITLE;
        this.currentRoomId = 'ruins_fall';
        
        this.player = {
            name: 'CHARA',
            lv: 1,
            hp: 20,
            maxHp: 20,
            exp: 0,
            gold: 0,
            x: 320,
            y: 350,
            speed: 3,
            inventory: [],
            weapon: null,
            armor: null
        };
        
        this.flags = {};
        
        // システム初期化
        this.input = new InputManager();
        this.audio = new AudioManager();
        this.save = new SaveManager();
        this.renderer = null;
        this.dialogue = null;
        this.battle = null;
        this.mapEngine = null;
        
        // 名前入力
        this.nameChars = '';
        this.nameKeyIndex = 0;
        this.nameButtonIndex = -1;
        
        // メニュー
        this.menuIndex = 0;

        // オーバーワールド
        this.canvas = null;
        this.ctx = null;
        this.running = false;
    }
    
    init() {
        const canvas = document.getElementById('game-canvas');
        this.renderer = new Renderer(canvas);
        this.dialogue = new DialogueSystem(this);
        this.battle = new BattleSystem(this);
        this.mapEngine = new MapEngine(this);
        
        this.buildNameKeyboard();
        this.bindEvents();
        this.showScreen('title');
        
        console.log('UNDERTALE Web initialized');
    }
    
    showScreen(name) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(name + '-screen').classList.add('active');
        this.state = name;
        
        if (name === 'title') {
            this.menuIndex = 0;
            this.updateTitleMenu();
        } else if (name === 'name') {
            this.nameChars = '';
            this.nameKeyIndex = 0;
            this.nameButtonIndex = -1;
            this.updateNameDisplay();
            this.updateNameKeyboard();
        } else if (name === 'game') {
            this.startOverworld();
        }
    }
    
    // タイトル画面
    updateTitleMenu() {
        const continueItem = document.querySelector('.menu-item[data-action="continue"]');
        if (continueItem) {
            continueItem.classList.toggle('disabled', !this.save.hasSave());
        }
        const items = document.querySelectorAll('.menu-item:not(.disabled)');
        document.querySelectorAll('.menu-item').forEach(e => e.classList.remove('selected'));
        if (items[this.menuIndex]) items[this.menuIndex].classList.add('selected');
    }
    
    selectTitleItem() {
        const items = document.querySelectorAll('.menu-item:not(.disabled)');
        const action = items[this.menuIndex]?.dataset.action;
        if (action === 'start') this.showScreen('name');
        else if (action === 'continue') this.loadGame();
    }
    
    // 名前入力
    buildNameKeyboard() {
        const kb = document.getElementById('keyboard');
        const rows = ['ABCDEFG','HIJKLMN','OPQRSTU','VWXYZ  ','abcdefg','hijklmn','opqrstu','vwxyz  '];
        kb.innerHTML = '';
        
        rows.forEach((row, ri) => {
            const rowEl = document.createElement('div');
            rowEl.className = 'kb-row';
            for (let ci = 0; ci < row.length; ci++) {
                const c = row[ci];
                const btn = document.createElement('button');
                btn.className = 'kb-key' + (c === ' ' ? ' empty' : '');
                btn.textContent = c === ' ' ? '' : c;
                btn.dataset.char = c;
                btn.dataset.idx = ri * 7 + ci;
                btn.onclick = () => c !== ' ' && this.addNameChar(c);
                rowEl.appendChild(btn);
            }
            kb.appendChild(rowEl);
        });
        
        document.querySelectorAll('.name-btn').forEach(b => {
            b.onclick = () => this.handleNameButton(b.dataset.action);
        });
    }
    
    updateNameKeyboard() {
        document.querySelectorAll('.kb-key').forEach((k, i) => {
            k.classList.toggle('selected', i === this.nameKeyIndex && this.nameButtonIndex === -1);
        });
        document.querySelectorAll('.name-btn').forEach((b, i) => {
            b.classList.toggle('selected', i === this.nameButtonIndex);
        });
    }
    
    addNameChar(c) {
        if (this.nameChars.length < 6) {
            this.nameChars += c;
            this.updateNameDisplay();
        }
    }
    
    updateNameDisplay() {
        document.getElementById('name-text').textContent = this.nameChars;
    }
    
    handleNameButton(action) {
        if (action === 'quit') {
            this.nameChars = '';
            this.showScreen('title');
        } else if (action === 'back') {
            this.nameChars = this.nameChars.slice(0, -1);
            this.updateNameDisplay();
        } else if (action === 'done') {
            if (this.nameChars.length > 0) {
                // 特殊名前チェック
                const special = SPECIAL_NAMES[this.nameChars.toUpperCase()];
                if (special) {
                    if (special.preventUse) {
                        alert(special.message.replace(/\* /g, '').replace(/\n/g, '\n'));
                        return;
                    }
                }
                this.player.name = this.nameChars;
                this.showScreen('game');
            }
        }
    }
    
    // オーバーワールド
    startOverworld() {
        this.running = true;
        this.mapEngine.loadRoom(this.currentRoomId);
        this.overworldLoop();
        
    }
    
    overworldLoop() {
        if (!this.running || this.state !== 'game') return;
        
        this.updateOverworld();
        this.renderOverworld();
        this.input.update();
        
        requestAnimationFrame(() => this.overworldLoop());
    }
    
    updateOverworld() {
        // ダイアログ中
        if (this.dialogue.active) {
            if (this.input.isConfirm()) this.dialogue.advance();
            return;
        }
        
        // 移動
        const move = this.input.getMovement();
        if (move.x !== 0 || move.y !== 0) {
            const newX = this.player.x + move.x * this.player.speed;
            const newY = this.player.y + move.y * this.player.speed;
            
            if (!this.mapEngine.checkCollision(newX, this.player.y)) {
                this.player.x = newX;
            }
            if (!this.mapEngine.checkCollision(this.player.x, newY)) {
                this.player.y = newY;
            }
        }
        
        // マップ更新
        this.mapEngine.update();
        
        // インタラクション
        if (this.input.isConfirm()) {
            // NPC
            const npc = this.mapEngine.getNearbyNPC(this.player.x, this.player.y);
            if (npc) {
                this.interactWithNPC(npc);
                return;
            }
            
            // セーブポイント
            if (this.mapEngine.isSavePointNear(this.player.x, this.player.y)) {
                this.saveGame();
                return;
            }
        }
    }
    
    interactWithNPC(npc) {
        if (npc.dialogue) {
            this.dialogue.show(npc.dialogue, () => {
                if (npc.battleOnEnd) {
                    this.battle.start(npc.battleOnEnd);
                }
            });
        } else if (npc.battleOnInteract) {
            this.battle.start(npc.battleOnInteract);
        }
    }
    
    renderOverworld() {
        const room = this.mapEngine.currentRoom;
        if (!room) return;
        
        this.renderer.updateCamera(this.player, room);
        this.renderer.drawRoom(room);
        
        // NPC描画
        if (room.npcs) {
            for (const npc of room.npcs) {
                if (npc.disappearFlag && this.flags[npc.disappearFlag]) continue;
                this.renderer.drawNPC(npc);
            }
        }
        
        // プレイヤー描画
        this.renderer.drawPlayer(this.player.x, this.player.y);
    }
    
    resumeOverworld() {
        this.running = true;
        this.overworldLoop();
    }
    
    pauseOverworld() {
        this.running = false;
    }
    
    // セーブ/ロード
    saveGame() {
        const room = this.mapEngine.currentRoom;
        const saveText = DIALOGUES['save_' + this.currentRoomId]?.texts || [
            `* （${room?.name || 'ここ'}）`,
            '* ケツイが みなぎった。'
        ];
        
        this.dialogue.showTexts(saveText, () => {
            const data = {
                player: { ...this.player },
                room: this.currentRoomId,
                flags: this.flags
            };
            
            if (this.save.save(data)) {
                this.player.hp = this.player.maxHp;
                this.dialogue.showText('* ファイルが セーブされた。');
            }
        });
    }
    
    loadGame() {
        const data = this.save.load();
        if (data) {
            Object.assign(this.player, data.player);
            this.flags = data.flags || {};
            this.currentRoomId = data.room || 'ruins_fall';
            this.showScreen('game');
        }
    }
    
    // イベント
    bindEvents() {
        // キーボード入力
        document.addEventListener('keydown', e => {
            if (this.state === 'title') {
                this.handleTitleInput(e.code);
            } else if (this.state === 'name') {
                this.handleNameInput(e.code);
            } else if (this.state === 'battle' && this.battle.active) {
                this.battle.handleInput();
            } else if (this.state === 'game' && e.code === 'KeyS' && !this.dialogue.active) {
                this.saveGame();
            } else if (this.state === 'gameover') {
                this.handleGameOverInput(e.code);
            }
        });
        
        // タイトルクリック
        document.querySelectorAll('.menu-item').forEach((item, i) => {
            item.onclick = () => {
                if (item.classList.contains('disabled')) return;
                const items = document.querySelectorAll('.menu-item:not(.disabled)');
                this.menuIndex = Array.from(items).indexOf(item);
                this.updateTitleMenu();
                this.selectTitleItem();
            };
        });
        
        // バトルメニュークリック
        document.querySelectorAll('.b-btn').forEach((btn, i) => {
            btn.onclick = () => {
                if (this.battle.active && this.battle.phase === 'menu') {
                    this.battle.menuIndex = i;
                    this.battle.updateBattleMenu();
                    this.battle.selectMenuAction();
                }
            };
        });
        
        // ゲームオーバー
        document.querySelectorAll('.go-btn').forEach(btn => {
            btn.onclick = () => {
                if (btn.dataset.action === 'retry') {
                    this.player.hp = this.player.maxHp;
                    this.showScreen('game');
                } else {
                    this.showScreen('title');
                }
            };
        });
    }
    
    handleTitleInput(code) {
        const items = document.querySelectorAll('.menu-item:not(.disabled)');
        if (code === 'ArrowUp') {
            this.menuIndex = Math.max(0, this.menuIndex - 1);
            this.updateTitleMenu();
        } else if (code === 'ArrowDown') {
            this.menuIndex = Math.min(items.length - 1, this.menuIndex + 1);
            this.updateTitleMenu();
        } else if (code === 'KeyZ' || code === 'Enter') {
            this.selectTitleItem();
        }
    }
    
    handleNameInput(code) {
        const totalKeys = 56;
        const cols = 7;
        
        if (this.nameButtonIndex === -1) {
            if (code === 'ArrowUp' && this.nameKeyIndex >= cols) this.nameKeyIndex -= cols;
            else if (code === 'ArrowDown') {
                if (this.nameKeyIndex < totalKeys - cols) this.nameKeyIndex += cols;
                else this.nameButtonIndex = 0;
            }
            else if (code === 'ArrowLeft' && this.nameKeyIndex % cols > 0) this.nameKeyIndex--;
            else if (code === 'ArrowRight' && this.nameKeyIndex % cols < cols - 1) this.nameKeyIndex++;
            else if (code === 'KeyZ' || code === 'Enter') {
                const btn = document.querySelectorAll('.kb-key')[this.nameKeyIndex];
                const char = btn?.dataset.char;
                if (char && char !== ' ') this.addNameChar(char);
            }
        } else {
            if (code === 'ArrowUp') { this.nameButtonIndex = -1; this.nameKeyIndex = 49; }
            else if (code === 'ArrowLeft') this.nameButtonIndex = Math.max(0, this.nameButtonIndex - 1);
            else if (code === 'ArrowRight') this.nameButtonIndex = Math.min(2, this.nameButtonIndex + 1);
            else if (code === 'KeyZ' || code === 'Enter') {
                this.handleNameButton(['quit', 'back', 'done'][this.nameButtonIndex]);
            }
        }
        
        if (code === 'KeyX' || code === 'Backspace') {
            this.handleNameButton('back');
        }
        
        this.updateNameKeyboard();
    }
    
    handleGameOverInput(code) {
        const btns = document.querySelectorAll('.go-btn');
        if (code === 'ArrowLeft' || code === 'ArrowRight') {
            btns.forEach(b => b.classList.toggle('selected'));
        } else if (code === 'KeyZ' || code === 'Enter') {
            const selected = document.querySelector('.go-btn.selected');
            if (selected?.dataset.action === 'retry') {
                this.player.hp = this.player.maxHp;
                this.showScreen('game');
            } else {
                this.showScreen('title');
            }
        }
    }
}
