// 攻撃パターン
const ATTACKS = {
    flowey_pellets: {
        name: 'pellets',
        duration: 180,
        setup(battle) {
            battle.bullets = [];
            // 「フレンドリィペレット」
            for (let i = 0; i < 5; i++) {
                battle.bullets.push({
                    x: 140 + i * 70,
                    y: -30 - i * 20,
                    vx: 0,
                    vy: 1.5,
                    w: 12,
                    h: 12,
                    type: 'pellet',
                    damage: 19,
                    trackFrames: 35,
                    speed: 2.2
                });
            }
        },
        update(battle, dt) {
            for (const b of battle.bullets) {
                if (b.trackFrames > 0) {
                    const targetX = battle.soul.x + 8;
                    const targetY = battle.soul.y + 8;
                    const dx = targetX - b.x;
                    const dy = targetY - b.y;
                    const len = Math.max(1, Math.hypot(dx, dy));
                    b.vx = (dx / len) * b.speed;
                    b.vy = (dy / len) * b.speed;
                    b.trackFrames--;
                } else {
                    b.vx *= 0.98;
                    b.vy += 0.02;
                }
                b.x += b.vx;
                b.y += b.vy;
            }
        }
    },
    
    froggit_flies: {
        name: 'flies',
        duration: 150,
        setup(battle) {
            battle.bullets = [];
            for (let i = 0; i < 6; i++) {
                battle.bullets.push({
                    x: Utils.randInt(50, BATTLE.BOX_WIDTH - 50),
                    y: -20 - i * 30,
                    vx: Utils.randFloat(-1, 1),
                    vy: Utils.randFloat(1.5, 2.5),
                    w: 10,
                    h: 10,
                    type: 'fly',
                    damage: 3
                });
            }
        },
        update(battle, dt) {
            for (const b of battle.bullets) {
                b.x += b.vx;
                b.y += b.vy;
                b.vx += Utils.randFloat(-0.1, 0.1);
            }
        }
    },
    
    froggit_jump: {
        name: 'jump',
        duration: 120,
        setup(battle) {
            battle.bullets = [];
            // 横から飛んでくる
            for (let i = 0; i < 3; i++) {
                const fromLeft = Math.random() > 0.5;
                battle.bullets.push({
                    x: fromLeft ? -20 : BATTLE.BOX_WIDTH + 20,
                    y: 30 + i * 35,
                    vx: fromLeft ? 4 : -4,
                    vy: 0,
                    w: 20,
                    h: 15,
                    type: 'frog',
                    damage: 4
                });
            }
        },
        update(battle, dt) {
            for (const b of battle.bullets) {
                b.x += b.vx;
            }
        }
    },
    
    whimsun_moths: {
        name: 'moths',
        duration: 120,
        setup(battle) {
            battle.bullets = [];
            for (let i = 0; i < 4; i++) {
                battle.bullets.push({
                    x: Utils.randInt(50, BATTLE.BOX_WIDTH - 50),
                    y: -20,
                    vx: 0,
                    vy: 1.5,
                    w: 8,
                    h: 8,
                    type: 'moth',
                    damage: 3,
                    wave: Utils.randFloat(0, Math.PI * 2)
                });
            }
        },
        update(battle, dt) {
            for (const b of battle.bullets) {
                b.wave += 0.1;
                b.x += Math.sin(b.wave) * 2;
                b.y += b.vy;
            }
        }
    },
    
    napstablook_tears: {
        name: 'tears',
        duration: 200,
        setup(battle) {
            battle.bullets = [];
            battle.tearTimer = 0;
        },
        update(battle, dt) {
            battle.tearTimer++;
            if (battle.tearTimer % 15 === 0) {
                battle.bullets.push({
                    x: Utils.randInt(30, BATTLE.BOX_WIDTH - 30),
                    y: -10,
                    vx: 0,
                    vy: Utils.randFloat(2, 3),
                    w: 10,
                    h: 14,
                    type: 'tear',
                    damage: 5
                });
            }
            for (const b of battle.bullets) {
                b.y += b.vy;
            }
        }
    },
    
    toriel_fire_spread: {
        name: 'fire_spread',
        duration: 240,
        setup(battle) {
            battle.bullets = [];
            battle.fireTimer = 0;
        },
        update(battle, dt) {
            battle.fireTimer++;
            if (battle.fireTimer % 30 === 0) {
                const cx = BATTLE.BOX_WIDTH / 2;
                for (let i = 0; i < 5; i++) {
                    const angle = (i / 5 - 0.5) * Math.PI * 0.6 - Math.PI / 2;
                    battle.bullets.push({
                        x: cx,
                        y: 0,
                        vx: Math.cos(angle) * 3,
                        vy: Math.sin(angle) * 3 + 2,
                        w: 15,
                        h: 15,
                        type: 'fire',
                        damage: 6
                    });
                }
            }
            for (const b of battle.bullets) {
                b.x += b.vx;
                b.y += b.vy;
            }
        }
    },
    
    toriel_fire_wave: {
        name: 'fire_wave',
        duration: 200,
        setup(battle) {
            battle.bullets = [];
            battle.waveTimer = 0;
            battle.waveDir = Math.random() > 0.5 ? 1 : -1;
        },
        update(battle, dt) {
            battle.waveTimer++;
            if (battle.waveTimer % 8 === 0) {
                battle.bullets.push({
                    x: battle.waveDir > 0 ? -15 : BATTLE.BOX_WIDTH + 15,
                    y: 20 + (battle.waveTimer / 8) * 12,
                    vx: battle.waveDir * 5,
                    vy: 0,
                    w: 12,
                    h: 12,
                    type: 'fire',
                    damage: 5
                });
            }
            for (const b of battle.bullets) {
                b.x += b.vx;
            }
        }
    }
};
