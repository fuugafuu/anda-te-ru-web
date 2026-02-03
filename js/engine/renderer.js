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
        
        // セーブポイント
        if (room.savePoint) {
            this.drawSavePoint(room.savePoint.x, room.savePoint.y);
        }
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
        
        this.ctx.font = '40px serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(npc.sprite, x, y);
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
