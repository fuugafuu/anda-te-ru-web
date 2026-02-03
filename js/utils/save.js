// セーブ管理
class SaveManager {
    constructor() {
        this.key = 'undertale_save';
    }
    
    hasSave() {
        return localStorage.getItem(this.key) !== null;
    }
    
    save(data) {
        try {
            const saveData = {
                ...data,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem(this.key, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }
    
    load() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }
    
    deleteSave() {
        localStorage.removeItem(this.key);
    }
    
    getSaveInfo() {
        const data = this.load();
        if (!data) return null;
        return {
            name: data.player?.name || 'CHARA',
            lv: data.player?.lv || 1,
            location: data.room || 'ruins_fall',
            time: new Date(data.timestamp).toLocaleString()
        };
    }
}
