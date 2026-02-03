// エントリーポイント
let game;

window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    game.init();
});

// デバッグ用
window.UNDERTALE = {
    game: () => game,
    teleport: (roomId) => game?.mapEngine.loadRoom(roomId),
    heal: () => { if (game) { game.player.hp = game.player.maxHp; } },
    addGold: (n) => { if (game) game.player.gold += n; },
    setLV: (lv) => {
        if (game && lv >= 1 && lv <= 20) {
            game.player.lv = lv;
            game.player.maxHp = LV_STATS[lv].hp;
            game.player.hp = game.player.maxHp;
        }
    },
    addItem: (id) => { if (game && ITEMS[id]) game.player.inventory.push(id); },
    setFlag: (flag, val = true) => { if (game) game.flags[flag] = val; },
    battle: (enemyId) => { if (game && ENEMIES[enemyId]) game.battle.start(enemyId); }
};
