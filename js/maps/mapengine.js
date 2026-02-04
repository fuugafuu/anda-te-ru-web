// マップエンジン
class MapEngine {
    constructor(game) {
        this.game = game;
        this.currentRoom = null;
        this.collision = new CollisionSystem();
    }
    
    loadRoom(roomId) {
        const room = MAPS[roomId];
        if (!room) {
            console.error('Room not found:', roomId);
            return;
        }
        
        this.currentRoom = room;
        this.game.currentRoomId = roomId;
        
        // スポーン位置
        if (room.spawn) {
            this.game.player.x = room.spawn.x;
            this.game.player.y = room.spawn.y;
        }
        
        // 音楽
        if (room.music) {
            this.game.audio.playMusic(room.music);
        }

        if (this.game.handleRoomEnter) {
            this.game.handleRoomEnter(roomId);
        }
    }
    
    loadRoomAt(roomId, spawnX, spawnY) {
        const room = MAPS[roomId];
        if (!room) return;
        
        this.currentRoom = room;
        this.game.currentRoomId = roomId;
        this.game.player.x = spawnX;
        this.game.player.y = spawnY;
        
        if (room.music) {
            this.game.audio.playMusic(room.music);
        }

        if (this.game.handleRoomEnter) {
            this.game.handleRoomEnter(roomId);
        }
    }
    
    update() {
        if (!this.currentRoom) return;
        
        const p = this.game.player;
        
        // 出口チェック
        const exit = this.collision.checkExit(p.x, p.y, this.currentRoom);
        if (exit) {
            // フラグ要件チェック
            if (exit.requireFlag && !this.game.flags[exit.requireFlag]) {
                return;
            }
            this.loadRoomAt(exit.to, exit.spawnX, exit.spawnY);
        }
        
        // ランダムエンカウント
        if (this.currentRoom.randomEncounters && this.game.input.anyMovement()) {
            if (Math.random() < (this.currentRoom.encounterRate || 0.02)) {
                const enemyId = Utils.randChoice(this.currentRoom.randomEncounters);
                this.game.battle.start(enemyId);
            }
        }
    }
    
    checkCollision(x, y) {
        if (!this.currentRoom) return true;
        return this.collision.checkWall(x, y, this.currentRoom);
    }
    
    getNearbyNPC(x, y) {
        if (!this.currentRoom || !this.currentRoom.npcs) return null;
        
        const visibleNPCs = this.currentRoom.npcs.filter(npc => {
            if (npc.disappearFlag && this.game.flags[npc.disappearFlag]) return false;
            return true;
        });
        
        return this.collision.checkNPC(x, y, visibleNPCs);
    }
    
    isSavePointNear(x, y) {
        if (!this.currentRoom) return false;
        return this.collision.checkSavePoint(x, y, this.currentRoom.savePoint);
    }
}
