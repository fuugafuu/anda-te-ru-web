// 描画エンジン
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.camera = { x: 0, y: 0 };
    }
    
    clear(color = '#000') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawRoom(room) {
        // 背景色
        this.ctx.fillStyle = room.bgColor || '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 床パターン
        this.ctx.fillStyle = this.adjustColor(room.bgColor || '#000', 20);
        for (let x = 0; x < room.width; x += 32) {
            for (let y = 0; y < room.height; y += 32) {
                if ((Math.floor(x/32) + Math.floor(y/32)) % 2 === 0) {
                    this.ctx.fillRect(x - this.camera.x, y - this.camera.y, 32, 32);
                }
            }
        }
        
        // 装飾（いせきの柱など）
        if (room.area === 'ruins') {
            this.ctx.fillStyle = '#4a2060';
            this.ctx.fillRect(50 - this.camera.x, 50 - this.camera.y, 60, 150);
            this.ctx.fillRect(room.width - 110 - this.camera.x, 50 - this.camera.y, 60, 150);
        }

        if (room.decorations) {
            for (const deco of room.decorations) {
                if (deco.type === 'lever') {
                    this.drawLever(deco.x, deco.y);
                    continue;
                }
                this.ctx.fillStyle = deco.color;
                this.ctx.fillRect(
                    deco.x - this.camera.x,
                    deco.y - this.camera.y,
                    deco.w,
                    deco.h
                );
            }
        }
        
        // セーブポイント
        if (room.savePoint) {
            this.drawSavePoint(room.savePoint.x, room.savePoint.y);
        }
    }

    drawExitHints(room, flags = {}) {
        if (!room.exits) return;
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (const exit of room.exits) {
            if (exit.requireFlag && !flags[exit.requireFlag]) continue;
            const cx = exit.x + exit.w / 2 - this.camera.x;
            const cy = exit.y + exit.h / 2 - this.camera.y;
            this.drawArrow(cx, cy, exit.w, exit.h);
        }
        this.ctx.restore();
    }

    drawArrow(cx, cy, w, h) {
        const size = 10;
        this.ctx.beginPath();
        if (w > h) {
            this.ctx.moveTo(cx - size, cy - size);
            this.ctx.lineTo(cx + size, cy);
            this.ctx.lineTo(cx - size, cy + size);
        } else {
            this.ctx.moveTo(cx - size, cy - size);
            this.ctx.lineTo(cx, cy + size);
            this.ctx.lineTo(cx + size, cy - size);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawSavePoint(x, y) {
        const time = Date.now() / 500;
        const glow = 0.5 + Math.sin(time) * 0.3;
        
        this.ctx.save();
        this.ctx.translate(x - this.camera.x, y - this.camera.y);
        
        // 光
        this.ctx.fillStyle = `rgba(255, 255, 0, ${glow * 0.3})`;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 25, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 星
        this.ctx.fillStyle = `rgba(255, 255, 0, ${glow})`;
        this.drawStar(0, 0, 12, 5);
        
        this.ctx.restore();
    }

    drawLever(x, y) {
        const px = x - this.camera.x;
        const py = y - this.camera.y;
        this.ctx.fillStyle = '#4b4b4b';
        this.ctx.fillRect(px - 8, py + 10, 16, 12);
        this.ctx.fillStyle = '#b22222';
        this.ctx.fillRect(px - 2, py - 14, 4, 24);
        this.ctx.beginPath();
        this.ctx.arc(px, py - 18, 6, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff4444';
        this.ctx.fill();
    }
    
    drawStar(cx, cy, r, points) {
        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? r : r * 0.4;
            const angle = (i * Math.PI / points) - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawPlayer(x, y, dir = 'down') {
        const px = x - this.camera.x;
        const py = y - this.camera.y;
        
        // 体（青いシャツ）
        this.ctx.fillStyle = '#3838ff';
        this.ctx.fillRect(px - 10, py - 30, 20, 25);
        
        // 肌
        this.ctx.fillStyle = '#ffc888';
        this.ctx.fillRect(px - 8, py - 45, 16, 16);
        
        // 髪（茶色）
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(px - 9, py - 50, 18, 10);
        
        // 足
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(px - 8, py - 5, 6, 8);
        this.ctx.fillRect(px + 2, py - 5, 6, 8);
    }
    
    drawNPC(npc) {
        const x = npc.x - this.camera.x;
        const y = npc.y - this.camera.y;

        if (npc.type === 'flower') {
            this.ctx.fillStyle = '#ffd166';
            this.ctx.beginPath();
            this.ctx.arc(x, y - 6, 10, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#2b7a3d';
            this.ctx.fillRect(x - 2, y + 2, 4, 18);
            return;
        }
        if (npc.type === 'goat') {
            this.ctx.fillStyle = '#f5f5f5';
            this.ctx.fillRect(x - 10, y - 14, 20, 28);
            this.ctx.fillStyle = '#b8b8b8';
            this.ctx.fillRect(x - 6, y - 4, 12, 18);
            return;
        }
        if (npc.type === 'dummy') {
            this.ctx.fillStyle = '#cfcfcf';
            this.ctx.fillRect(x - 8, y - 12, 16, 24);
            this.ctx.fillStyle = '#999';
            this.ctx.fillRect(x - 6, y + 6, 12, 6);
            return;
        }
        if (npc.type === 'guard') {
            this.ctx.fillStyle = '#6b7280';
            this.ctx.fillRect(x - 10, y - 12, 20, 24);
            this.ctx.fillStyle = '#374151';
            this.ctx.fillRect(x - 6, y - 8, 12, 16);
            return;
        }

        this.ctx.fillStyle = '#d1d5db';
        this.ctx.fillRect(x - 8, y - 10, 16, 20);
    }
    
    updateCamera(player, room) {
        // ルームがスクリーンより大きい場合のみカメラ移動
        if (room.width > this.width) {
            this.camera.x = Utils.clamp(
                player.x - this.width / 2,
                0,
                room.width - this.width
            );
        } else {
            this.camera.x = 0;
        }
        
        if (room.height > this.height) {
            this.camera.y = Utils.clamp(
                player.y - this.height / 2,
                0,
                room.height - this.height
            );
        } else {
            this.camera.y = 0;
        }
    }
    
    adjustColor(hex, amount) {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.min(255, ((num >> 16) & 255) + amount);
        const g = Math.min(255, ((num >> 8) & 255) + amount);
        const b = Math.min(255, (num & 255) + amount);
        return `rgb(${r},${g},${b})`;
    }
}
