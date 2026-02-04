// バトルシステム
class BattleSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.phase = 'menu';
        this.enemy = null;
        this.menuIndex = 0;
        this.subIndex = 0;
        this.turnCount = 0;
        this.spareable = false;
        this.flags = {};
        
        this.soul = { x: 280, y: 60 };
        this.soulSpeed = 4;
        this.invincible = false;
        this.invincibleTimer = 0;
        
        this.bullets = [];
        this.attackTimer = 0;
        this.currentAttack = null;
        this.atkMeterPos = 0;
        this.atkMeterDir = 1;
        this.atkInterval = null;
        this.cutsceneActive = false;
        this.specialHit = false;
        this.cutsceneLastHit = false;
        this.cutsceneHitCount = 0;
        this.cutsceneMissCount = 0;
        this.cutsceneAttackRegistered = false;
        
        this.elements = {
            text: document.getElementById('battle-text'),
            soul: document.getElementById('soul'),
            atkMeter: document.getElementById('atk-meter'),
            atkBar: document.getElementById('atk-bar'),
            submenu: document.getElementById('submenu'),
            enemyDialog: document.getElementById('enemy-dialog'),
            hpBar: document.getElementById('hp-bar'),
            hpCur: document.getElementById('hp-cur'),
            hpMax: document.getElementById('hp-max'),
            pName: document.getElementById('p-name'),
            pLv: document.getElementById('p-lv'),
            enemySprite: document.getElementById('enemy-sprite'),
            enemyHpContainer: document.getElementById('enemy-hp-container'),
            enemyHpBar: document.getElementById('enemy-hp-bar')
        };
    }
    
    start(enemyId) {
        const enemyData = ENEMIES[enemyId];
        if (!enemyData) { console.error('Enemy not found:', enemyId); return; }
        
        this.enemy = { ...enemyData, currentHp: enemyData.hp };
        this.active = true;
        this.phase = 'menu';
        this.menuIndex = 0;
        this.turnCount = 0;
        this.spareable = false;
        this.flags = {};
        this.bullets = [];
        this.cutsceneActive = false;
        this.specialHit = false;
        this.cutsceneLastHit = false;
        this.cutsceneHitCount = 0;
        this.cutsceneMissCount = 0;
        this.cutsceneAttackRegistered = false;
        
        this.elements.enemySprite.textContent = this.enemy.sprite;
        this.elements.text.innerHTML = `* ${this.enemy.name}が あらわれた！`;
        this.elements.enemyDialog.classList.remove('active');
        this.elements.enemyDialog.textContent = '';
        this.elements.submenu.classList.remove('active');
        this.elements.soul.classList.remove('active');
        this.elements.atkMeter.classList.remove('active');
        this.elements.enemyHpContainer.classList.remove('active');
        const battleScreen = document.getElementById('battle-screen');
        battleScreen.classList.remove('cutscene');
        battleScreen.classList.add('battle-start');
        setTimeout(() => battleScreen.classList.remove('battle-start'), 350);
        
        this.updatePlayerStats();
        this.updateBattleMenu();
        this.game.showScreen('battle');

        if (this.enemy.specialSequence && this.enemy.specialSequence.length) {
            this.startCutsceneBattle();
        }
    }
    
    updatePlayerStats() {
        const p = this.game.player;
        this.elements.pName.textContent = p.name;
        this.elements.pLv.textContent = p.lv;
        this.elements.hpCur.textContent = p.hp;
        this.elements.hpMax.textContent = p.maxHp;
        this.elements.hpBar.style.width = (p.hp / p.maxHp * 100) + '%';
    }
    
    updateBattleMenu() {
        document.querySelectorAll('.b-btn').forEach((btn, i) => {
            btn.classList.toggle('selected', i === this.menuIndex);
        });
    }
    
    handleInput() {
        const input = this.game.input;
        if (this.cutsceneActive) return;
        
        if (this.phase === 'menu') {
            if (input.justPressed('ArrowLeft')) { this.menuIndex = Math.max(0, this.menuIndex - 1); this.updateBattleMenu(); }
            if (input.justPressed('ArrowRight')) { this.menuIndex = Math.min(3, this.menuIndex + 1); this.updateBattleMenu(); }
            if (input.isConfirm()) this.selectMenuAction();
        } else if (this.phase === 'sub') {
            const items = document.querySelectorAll('.sub-item');
            if (input.justPressed('ArrowUp')) { this.subIndex = Math.max(0, this.subIndex - 1); this.updateSubmenu(); }
            if (input.justPressed('ArrowDown')) { this.subIndex = Math.min(items.length - 1, this.subIndex + 1); this.updateSubmenu(); }
            if (input.isConfirm()) this.selectSubmenuAction();
            if (input.isCancel()) { this.elements.submenu.classList.remove('active'); this.phase = 'menu'; }
        } else if (this.phase === 'attack') {
            if (input.isConfirm()) this.confirmAttack();
        } else if (this.phase === 'text') {
            if (input.isConfirm()) {
                this.phase = 'menu';
                this.showEnemyDialogue(Utils.randChoice(this.enemy.dialogue || ['・・・']));
            }
        }
    }
    
    selectMenuAction() {
        const actions = ['fight', 'act', 'item', 'mercy'];
        const action = actions[this.menuIndex];
        if (action === 'fight') this.startAttackMeter();
        else if (action === 'act') this.showActMenu();
        else if (action === 'item') this.showItemMenu();
        else if (action === 'mercy') this.showMercyMenu();
    }
    
    startAttackMeter() {
        this.phase = 'attack';
        this.elements.text.innerHTML = '';
        this.elements.atkMeter.classList.add('active');
        this.atkMeterPos = 0;
        this.atkMeterDir = 1;
        this.atkInterval = setInterval(() => {
            this.atkMeterPos += this.atkMeterDir * BATTLE.ATTACK_METER_SPEED;
            if (this.atkMeterPos > 560 || this.atkMeterPos < 0) this.atkMeterDir *= -1;
            this.elements.atkBar.style.left = this.atkMeterPos + 'px';
        }, 16);
    }
    
    confirmAttack() {
        clearInterval(this.atkInterval);
        this.elements.atkMeter.classList.remove('active');
        
        const center = 280;
        const dist = Math.abs(this.atkMeterPos - center);
        const multiplier = Math.max(0.1, 1 - dist / 300);
        
        const p = this.game.player;
        const weaponAtk = p.weapon ? ITEMS[p.weapon].atk : 0;
        let damage = Utils.calcPlayerDamage(LV_STATS[p.lv].at + 10, weaponAtk, this.enemy.def, multiplier);
        
        if (this.enemy.onHit) {
            const result = this.enemy.onHit(this, damage);
            if (result) {
                this.elements.text.innerHTML = result.text.replace(/\n/g, '<br>');
                this.phase = 'text';
                setTimeout(() => this.startEnemyTurn(), 1500);
                return;
            }
        }
        
        this.enemy.currentHp -= damage;
        this.showDamageNumber(damage);
        
        this.elements.enemyHpContainer.classList.add('active');
        this.elements.enemyHpBar.style.width = Math.max(0, this.enemy.currentHp / this.enemy.maxHp * 100) + '%';
        
        if (this.enemy.currentHp <= 0) {
            this.enemyDefeated();
        } else {
            this.elements.text.innerHTML = `* ${damage} ダメージ！`;
            this.phase = 'text';
            setTimeout(() => this.startEnemyTurn(), 1000);
        }
    }
    
    showDamageNumber(damage) {
        const num = document.createElement('div');
        num.className = 'damage-num';
        num.textContent = damage;
        num.style.left = '300px';
        num.style.top = '150px';
        document.getElementById('battle-screen').appendChild(num);
        setTimeout(() => num.remove(), 1000);
    }
    
    showActMenu() {
        this.phase = 'sub';
        this.subIndex = 0;
        const acts = this.enemy.acts || [{ name: 'チェック', action: 'check' }];
        this.elements.submenu.innerHTML = acts.map((act, i) => 
            `<div class="sub-item${i === 0 ? ' selected' : ''}" data-action="${act.action}">* ${act.name}</div>`
        ).join('');
        this.elements.submenu.classList.add('active');
        this.elements.text.innerHTML = '';
    }
    
    showItemMenu() {
        const inv = this.game.player.inventory;
        if (!inv || inv.length === 0) { this.elements.text.innerHTML = '* アイテムを もっていない'; return; }
        this.phase = 'sub';
        this.subIndex = 0;
        this.elements.submenu.innerHTML = inv.map((itemId, i) => {
            const item = ITEMS[itemId];
            return `<div class="sub-item${i === 0 ? ' selected' : ''}" data-action="use" data-item="${itemId}">* ${item.name}</div>`;
        }).join('');
        this.elements.submenu.classList.add('active');
        this.elements.text.innerHTML = '';
    }
    
    showMercyMenu() {
        this.phase = 'sub';
        this.subIndex = 0;
        const spareClass = this.spareable ? ' yellow' : '';
        this.elements.submenu.innerHTML = `
            <div class="sub-item selected${spareClass}" data-action="spare">* みのがす</div>
            <div class="sub-item" data-action="flee">* にげる</div>
        `;
        this.elements.submenu.classList.add('active');
        this.elements.text.innerHTML = '';
    }
    
    updateSubmenu() {
        document.querySelectorAll('.sub-item').forEach((item, i) => item.classList.toggle('selected', i === this.subIndex));
    }
    
    selectSubmenuAction() {
        const item = document.querySelectorAll('.sub-item')[this.subIndex];
        const action = item.dataset.action;
        this.elements.submenu.classList.remove('active');
        
        if (action === 'check') {
            this.elements.text.innerHTML = (this.enemy.check || '* ・・・').replace(/\n/g, '<br>');
            this.phase = 'text';
            setTimeout(() => this.startEnemyTurn(), 1500);
        } else if (action === 'spare') {
            this.attemptSpare();
        } else if (action === 'flee') {
            this.attemptFlee();
        } else if (action === 'use') {
            this.useItem(item.dataset.item);
        } else {
            this.doAct(action);
        }
    }
    
    doAct(action) {
        const handlerName = 'on' + action.charAt(0).toUpperCase() + action.slice(1);
        let result = '* なにも おこらなかった。';
        if (this.enemy[handlerName]) result = this.enemy[handlerName](this);
        this.elements.text.innerHTML = result.replace(/\n/g, '<br>');
        this.phase = 'text';
        setTimeout(() => this.startEnemyTurn(), 1500);
    }
    
    attemptSpare() {
        if (this.enemy.onSpare) {
            const result = this.enemy.onSpare(this);
            if (result) this.elements.text.innerHTML = result.replace(/\n/g, '<br>');
        }
        if (this.spareable || (this.enemy.spareCondition && this.enemy.spareCondition(this))) {
            this.spareEnemy();
        } else {
            this.elements.text.innerHTML = `* ${this.enemy.name}は みのがして もらえないようだ`;
            this.phase = 'text';
            setTimeout(() => this.startEnemyTurn(), 1000);
        }
    }
    
    attemptFlee() {
        if (!this.enemy.canFlee) {
            this.elements.text.innerHTML = '* にげられない！';
            this.phase = 'text';
            setTimeout(() => this.startEnemyTurn(), 1000);
        } else {
            this.elements.text.innerHTML = '* にげだした！';
            setTimeout(() => this.endBattle(false), 1000);
        }
    }
    
    useItem(itemId) {
        const item = ITEMS[itemId];
        if (!item) return;
        const idx = this.game.player.inventory.indexOf(itemId);
        if (idx > -1) this.game.player.inventory.splice(idx, 1);
        if (item.heal) {
            const healed = Math.min(item.heal, this.game.player.maxHp - this.game.player.hp);
            this.game.player.hp += healed;
            this.updatePlayerStats();
            this.elements.text.innerHTML = (item.useText || `* ${item.name}を つかった！`).replace(/\n/g, '<br>');
        }
        this.phase = 'text';
        setTimeout(() => this.startEnemyTurn(), 1000);
    }
    
    startEnemyTurn() {
        this.turnCount++;
        this.phase = 'enemy';
        this.elements.text.innerHTML = '';
        this.elements.enemyDialog.classList.remove('active');
        this.soul = { x: 280, y: 60 };
        this.elements.soul.classList.add('active');
        this.updateSoulPosition();
        
        const attacks = this.enemy.attacks || [];
        if (attacks.length > 0) {
            const attackId = Utils.randChoice(attacks);
            this.currentAttack = ATTACKS[attackId];
            if (this.currentAttack) this.currentAttack.setup(this);
        }
        
        this.attackTimer = 0;
        this.enemyTurnLoop();
    }
    
    enemyTurnLoop() {
        if (this.phase !== 'enemy') return;
        
        this.attackTimer++;
        
        const input = this.game.input;
        if (input.isUp()) this.soul.y -= this.soulSpeed;
        if (input.isDownDir()) this.soul.y += this.soulSpeed;
        if (input.isLeft()) this.soul.x -= this.soulSpeed;
        if (input.isRight()) this.soul.x += this.soulSpeed;
        this.soul.x = Utils.clamp(this.soul.x, 0, BATTLE.BOX_WIDTH - 16);
        this.soul.y = Utils.clamp(this.soul.y, 0, BATTLE.BOX_HEIGHT - 16);
        this.updateSoulPosition();
        
        if (this.currentAttack) this.currentAttack.update(this, 1);
        if (!this.invincible) this.checkBulletCollision();
        
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
                this.elements.soul.classList.remove('invincible');
            }
        }
        
        this.renderBullets();
        
        const duration = this.currentAttack ? this.currentAttack.duration : 180;
        if (this.attackTimer >= duration) { this.endEnemyTurn(); return; }
        requestAnimationFrame(() => this.enemyTurnLoop());
    }
    
    updateSoulPosition() {
        this.elements.soul.style.left = this.soul.x + 'px';
        this.elements.soul.style.top = this.soul.y + 'px';
    }
    
    checkBulletCollision() {
        const soulRect = { x: this.soul.x, y: this.soul.y, w: 16, h: 16 };
        for (const bullet of this.bullets) {
            if (Utils.rectCollision(soulRect, { x: bullet.x, y: bullet.y, w: bullet.w, h: bullet.h })) {
                this.takeDamage(bullet.damage);
                break;
            }
        }
    }
    
    takeDamage(baseDamage) {
        const p = this.game.player;
        const armorDef = p.armor ? ITEMS[p.armor].def : 0;
        const damage = Math.max(1, baseDamage - LV_STATS[p.lv].df - armorDef);
        p.hp -= damage;
        if (this.cutsceneActive) {
            this.specialHit = true;
            this.cutsceneLastHit = true;
            if (!this.cutsceneAttackRegistered) {
                this.cutsceneHitCount++;
                this.cutsceneAttackRegistered = true;
            }
            p.hp = Math.max(1, p.hp);
        }
        this.updatePlayerStats();
        this.invincible = true;
        this.invincibleTimer = BATTLE.INVINCIBILITY_FRAMES;
        this.elements.soul.classList.add('invincible');
        if (p.hp <= 0 && !this.cutsceneActive) { p.hp = 0; this.updatePlayerStats(); this.gameOver(); }
    }
    
    renderBullets() {
        document.querySelectorAll('.bullet').forEach(b => b.remove());
        const box = document.getElementById('battle-box');
        for (const bullet of this.bullets) {
            if (bullet.y < -30 || bullet.y > BATTLE.BOX_HEIGHT + 30) continue;
            if (bullet.x < -30 || bullet.x > BATTLE.BOX_WIDTH + 30) continue;
            const el = document.createElement('div');
            el.className = 'bullet ' + (bullet.type || 'pellet');
            el.style.left = bullet.x + 'px';
            el.style.top = bullet.y + 'px';
            el.style.width = bullet.w + 'px';
            el.style.height = bullet.h + 'px';
            box.appendChild(el);
        }
    }
    
    endEnemyTurn() {
        this.elements.soul.classList.remove('active');
        this.bullets = [];
        document.querySelectorAll('.bullet').forEach(b => b.remove());
        this.phase = 'menu';
        this.showEnemyDialogue(Utils.randChoice(this.enemy.dialogue || ['・・・']));
    }
    
    enemyDefeated() {
        this.elements.text.innerHTML = `* ${this.enemy.name}を たおした！<br>* ${this.enemy.exp} EXP と ${this.enemy.gold} G を てにいれた！`;
        this.game.player.exp += this.enemy.exp;
        this.game.player.gold += this.enemy.gold;
        const levelUp = Utils.checkLevelUp(this.game.player.exp, this.game.player.lv);
        if (levelUp) {
            this.game.player.lv = levelUp.newLv;
            this.game.player.maxHp = levelUp.stats.hp;
            this.game.player.hp = this.game.player.maxHp;
        }
        setTimeout(() => this.endBattle(true), 2000);
    }
    
    spareEnemy() {
        this.elements.text.innerHTML = `* ${this.enemy.name}を みのがした！<br>* ${this.enemy.gold} G を てにいれた！`;
        this.game.player.gold += this.enemy.gold;
        setTimeout(() => this.endBattle(false), 1500);
    }
    
    endBattle(killed) {
        this.active = false;
        this.bullets = [];
        document.querySelectorAll('.bullet').forEach(b => b.remove());
        document.getElementById('battle-screen').classList.remove('cutscene');
        if (killed) this.game.flags[this.enemy.id + '_killed'] = true;
        else this.game.flags[this.enemy.id + '_spared'] = true;
        if (this.enemy?.id !== 'flowey_tutorial') {
            this.game.updateRoute(killed);
        }
        this.game.showScreen('game');
        this.game.resumeOverworld();
    }
    
    gameOver() {
        this.active = false;
        this.game.showScreen('gameover');
    }

    showEnemyDialogue(text) {
        if (!this.elements.enemyDialog) return;
        this.elements.enemyDialog.textContent = text;
        this.elements.enemyDialog.classList.add('active');
    }

    startCutsceneBattle() {
        this.cutsceneActive = true;
        this.phase = 'cutscene';
        this.elements.submenu.classList.remove('active');
        this.elements.soul.classList.remove('active');
        this.elements.atkMeter.classList.remove('active');
        document.getElementById('battle-screen').classList.add('cutscene');
        this.runCutsceneStep(0);
    }

    runCutsceneStep(index) {
        const sequence = this.enemy.specialSequence || [];
        if (index >= sequence.length) {
            this.cutsceneActive = false;
            if (this.enemy?.id === 'flowey_tutorial') {
                this.game.flags.flowey_intro_done = true;
            }
            this.endBattle(false);
            if (this.enemy?.id === 'flowey_tutorial') {
                this.game.mapEngine.loadRoom('ruins_entrance');
                this.game.dialogue.show('toriel_rescue');
            }
            return;
        }
        const step = sequence[index];
        if (step.type === 'text') {
            this.elements.text.innerHTML = (step.text || '').replace(/\n/g, '<br>');
            this.phase = 'cutscene';
            const wait = step.wait || 1400;
            setTimeout(() => this.runCutsceneStep(index + 1), wait);
            return;
        }
        if (step.type === 'attack') {
            const nextOnHit = Number.isInteger(step.nextOnHit) ? step.nextOnHit : index + 1;
            const nextOnMiss = Number.isInteger(step.nextOnMiss) ? step.nextOnMiss : index + 1;
            this.startCutsceneAttack(step.attack, step.duration || 180, () => {
                const nextIndex = this.cutsceneLastHit ? nextOnHit : nextOnMiss;
                this.runCutsceneStep(nextIndex);
            });
        }
    }

    startCutsceneAttack(attackId, duration, onComplete) {
        this.phase = 'enemy';
        this.elements.text.innerHTML = '';
        this.soul = { x: 280, y: 60 };
        this.elements.soul.classList.add('active');
        this.updateSoulPosition();

        this.bullets = [];
        this.currentAttack = ATTACKS[attackId];
        if (this.currentAttack) this.currentAttack.setup(this);
        this.attackTimer = 0;
        this.cutsceneLastHit = false;
        this.cutsceneAttackRegistered = false;

        const loop = () => {
            if (!this.cutsceneActive || this.phase !== 'enemy') return;
            this.attackTimer++;

            const input = this.game.input;
            if (input.isUp()) this.soul.y -= this.soulSpeed;
            if (input.isDownDir()) this.soul.y += this.soulSpeed;
            if (input.isLeft()) this.soul.x -= this.soulSpeed;
            if (input.isRight()) this.soul.x += this.soulSpeed;
            this.soul.x = Utils.clamp(this.soul.x, 0, BATTLE.BOX_WIDTH - 16);
            this.soul.y = Utils.clamp(this.soul.y, 0, BATTLE.BOX_HEIGHT - 16);
            this.updateSoulPosition();

            if (this.currentAttack) this.currentAttack.update(this, 1);
            if (!this.invincible) this.checkBulletCollision();

            if (this.invincible) {
                this.invincibleTimer--;
                if (this.invincibleTimer <= 0) {
                    this.invincible = false;
                    this.elements.soul.classList.remove('invincible');
                }
            }

            this.renderBullets();
            if (this.attackTimer >= duration) {
                this.elements.soul.classList.remove('active');
                this.bullets = [];
                document.querySelectorAll('.bullet').forEach(b => b.remove());
                this.phase = 'cutscene';
                if (!this.cutsceneAttackRegistered) {
                    this.cutsceneMissCount++;
                }
                if (onComplete) onComplete();
                return;
            }
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}
