// 音声管理
class AudioManager {
    constructor() {
        this.bgm = document.getElementById('bgm');
        this.sfx = document.getElementById('sfx');
        this.musicVol = 0.7;
        this.sfxVol = 0.8;
        this.currentMusic = null;
    }
    
    playMusic(id, loop = true) {
        if (!this.bgm || this.currentMusic === id) return;
        this.bgm.src = `assets/audio/music/${id}.ogg`;
        this.bgm.volume = this.musicVol;
        this.bgm.loop = loop;
        this.bgm.play().catch(() => {});
        this.currentMusic = id;
    }
    
    stopMusic() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.currentMusic = null;
        }
    }
    
    pauseMusic() {
        if (this.bgm) this.bgm.pause();
    }
    
    resumeMusic() {
        if (this.bgm && this.currentMusic) {
            this.bgm.play().catch(() => {});
        }
    }
    
    playSFX(id, vol = 1) {
        // 音声ファイルがない場合は何もしない
        const audio = new Audio(`assets/audio/sfx/${id}.ogg`);
        audio.volume = this.sfxVol * vol;
        audio.play().catch(() => {});
    }
    
    setMusicVolume(vol) {
        this.musicVol = Utils.clamp(vol, 0, 1);
        if (this.bgm) this.bgm.volume = this.musicVol;
    }
    
    setSFXVolume(vol) {
        this.sfxVol = Utils.clamp(vol, 0, 1);
    }
}
