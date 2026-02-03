// 衝突判定
class CollisionSystem {
    constructor() {
        this.playerSize = { w: 16, h: 20 };
    }
    
    checkWall(x, y, room) {
        // ルーム境界
        if (x < 20 || x > room.width - 20) return true;
        if (y < 20 || y > room.height) return true;
        
        // 衝突オブジェクト
        if (room.collision) {
            for (const c of room.collision) {
                if (this.pointInRect(x, y, c)) return true;
            }
        }
        
        return false;
    }
    
    checkExit(x, y, room) {
        if (!room.exits) return null;
        
        for (const exit of room.exits) {
            if (this.pointInRect(x, y, exit)) {
                return exit;
            }
        }
        
        return null;
    }
    
    checkNPC(x, y, npcs, range = 30) {
        if (!npcs) return null;
        
        for (const npc of npcs) {
            const dist = Utils.distance(x, y, npc.x, npc.y);
            if (dist < range) {
                return npc;
            }
        }
        
        return null;
    }
    
    checkSavePoint(x, y, savePoint, range = 25) {
        if (!savePoint) return false;
        return Utils.distance(x, y, savePoint.x, savePoint.y) < range;
    }
    
    pointInRect(px, py, rect) {
        return px >= rect.x && px <= rect.x + rect.w &&
               py >= rect.y && py <= rect.y + rect.h;
    }
    
    rectCollision(r1, r2) {
        return r1.x < r2.x + r2.w &&
               r1.x + r1.w > r2.x &&
               r1.y < r2.y + r2.h &&
               r1.y + r1.h > r2.y;
    }
}
