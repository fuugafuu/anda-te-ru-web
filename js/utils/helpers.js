// ユーティリティ関数
const Utils = {
    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },
    
    lerp(a, b, t) {
        return a + (b - a) * t;
    },
    
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    randFloat(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    randChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
    
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    },
    
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2-y1, x2-x1);
    },
    
    rectCollision(r1, r2) {
        return r1.x < r2.x + r2.w &&
               r1.x + r1.w > r2.x &&
               r1.y < r2.y + r2.h &&
               r1.y + r1.h > r2.y;
    },
    
    pointInRect(px, py, rect) {
        return px >= rect.x && px <= rect.x + rect.w &&
               py >= rect.y && py <= rect.y + rect.h;
    },
    
    wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    },
    
    calcDamage(atk, def) {
        const base = atk - def;
        const rand = Utils.randInt(-2, 2);
        return Math.max(1, base + rand);
    },
    
    calcPlayerDamage(playerAtk, weaponAtk, enemyDef, multiplier = 1) {
        const base = (playerAtk + weaponAtk - enemyDef) * multiplier;
        const rand = Utils.randInt(-2, 2);
        return Math.max(1, Math.floor(base + rand));
    },
    
    checkLevelUp(exp, currentLv) {
        if (currentLv >= 20) return null;
        const needed = LV_THRESHOLDS[currentLv];
        if (exp >= needed) {
            return {
                newLv: currentLv + 1,
                stats: LV_STATS[currentLv + 1]
            };
        }
        return null;
    }
};
