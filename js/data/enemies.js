// 敵データ
const ENEMIES = {
    flowey_tutorial: {
        id: 'flowey_tutorial',
        name: 'フラウィ',
        hp: 1, maxHp: 1,
        atk: 0, def: 0,
        exp: 0, gold: 0,
        sprite: '🌻',
        canFlee: false,
        specialSequence: [
            { type: 'text', text: '* それが きみの こころのひかり。' },
            { type: 'text', text: '* きみそのもの みたいな ものさ。' },
            { type: 'text', text: '* つよくなるには\n  「LV」が ひつよう。' },
            { type: 'text', text: '* なんだか わかる？\n  ラブって よぶんだ。' },
            { type: 'text', text: '* いまから すこし わけてあげるね。' },
            { type: 'text', text: '* ラブは ちいさな\n  なかよしカプセルに つめるんだ。' },
            { type: 'attack', attack: 'flowey_pellets', duration: 200 },
            {
                type: 'branch',
                onHit: '* うっかりさんだね。\n* ここは いきるか しぬか だけ。',
                onMiss: '* へえ、よけられるんだ。\n* ここは いきるか しぬか だけ。'
            },
            { type: 'text', text: '* <span class="battle-text-big">おわりだ</span>' },
            { type: 'text', text: '* つよい ひかりが さしこんだ。' },
            { type: 'text', text: '* フラウィーは かぜに ふきとばされた！' },
            { type: 'text', text: '* 「ここまでよ、わがこ。」' }
        ],
        check: '* フラウィ - ATK 0 DEF 0\n* はなの ガイド。にこにこ している。',
        acts: [
            { name: 'チェック', action: 'check' },
            { name: 'はなす', action: 'talk' }
        ],
        dialogue: ['あはは！', 'あおいひかりを あつめてね！'],
        attacks: ['flowey_pellets'],
        onCheck: function(battle) {
            return this.check;
        },
        onTalk: function(battle) {
            return '* フラウィに はなしかけた。\n* はなびらが ゆれている。';
        }
    },
    
    dummy: {
        id: 'dummy',
        name: 'ダミー',
        hp: 20, maxHp: 20,
        atk: 0, def: 0,
        exp: 0, gold: 0,
        sprite: '🎭',
        canFlee: true,
        check: '* ダミー - ATK 0 DEF 0\n* コットン100%。きもちが こもっていない。',
        acts: [
            { name: 'チェック', action: 'check' },
            { name: 'はなす', action: 'talk' }
        ],
        spareCondition: function(battle) {
            return battle.turnCount >= 1;
        },
        onTalk: function(battle) {
            battle.spareable = true;
            return '* ダミーに はなしかけた。\n* ダミーは なにも いわない。';
        }
    },
    
    froggit: {
        id: 'froggit',
        name: 'フロギー',
        hp: 30, maxHp: 30,
        atk: 4, def: 5,
        exp: 3, gold: 2,
        sprite: '🐸',
        canFlee: true,
        check: '* フロギー - ATK 4 DEF 5\n* いきるのが たいへんな てき。',
        acts: [
            { name: 'チェック', action: 'check' },
            { name: 'ほめる', action: 'compliment' },
            { name: 'おどす', action: 'threaten' }
        ],
        attacks: ['froggit_flies', 'froggit_jump'],
        dialogue: ['ケロ...', 'リボビット！'],
        spareCondition: function(battle) {
            return battle.flags.complimented || battle.flags.threatened;
        },
        onCompliment: function(battle) {
            battle.flags.complimented = true;
            battle.spareable = true;
            return '* フロギーを ほめた。\n* フロギーは よくわかっていないが\n  うれしそうだ。';
        },
        onThreaten: function(battle) {
            battle.flags.threatened = true;
            battle.spareable = true;
            return '* フロギーを おどした。\n* フロギーは こわがっている。';
        }
    },
    
    whimsun: {
        id: 'whimsun',
        name: 'ナキムシ',
        hp: 10, maxHp: 10,
        atk: 5, def: 0,
        exp: 2, gold: 2,
        sprite: '🦋',
        canFlee: true,
        check: '* ナキムシ - ATK 5 DEF 0\n* きずつきやすすぎて たたかえない・・・',
        acts: [
            { name: 'チェック', action: 'check' },
            { name: 'なぐさめる', action: 'console' },
            { name: 'おどす', action: 'terrorize' }
        ],
        attacks: ['whimsun_moths'],
        spareCondition: function() { return true; },
        onConsole: function(battle) {
            return '* ナキムシを なぐさめた。\n* ナキムシは にげてしまった！';
        },
        onTerrorize: function(battle) {
            return '* ナキムシを おどした。\n* ナキムシは にげてしまった！';
        }
    },
    
    napstablook: {
        id: 'napstablook',
        name: 'ナプスタブルーク',
        hp: 88, maxHp: 88,
        atk: 10, def: 10,
        exp: 0, gold: 0,
        sprite: '👻',
        canFlee: true,
        isBoss: true,
        check: '* ナプスタブルーク - ATK 10 DEF 10\n* このゴーストは ずっとここにいる。\n  にんげんが いないから・・・',
        acts: [
            { name: 'チェック', action: 'check' },
            { name: 'チアー', action: 'cheer' },
            { name: 'フレックス', action: 'flex' },
            { name: 'おどす', action: 'threaten' }
        ],
        attacks: ['napstablook_tears'],
        dialogue: ['おおおおおおおおおお', '（ないてるふりをしている）'],
        flags: { cheerCount: 0 },
        spareCondition: function(battle) {
            return battle.flags.cheerCount >= 3;
        },
        onCheer: function(battle) {
            battle.flags.cheerCount = (battle.flags.cheerCount || 0) + 1;
            if (battle.flags.cheerCount >= 3) {
                battle.spareable = true;
                return '* ナプスタブルークを はげました。\n* 「みて・・・ぼく・・・\n  なみだで ぼうしを つくったんだ・・・」';
            }
            return '* ナプスタブルークを はげました。\n* すこし げんきが でたようだ。';
        },
        onHit: function(battle, damage) {
            return { text: '* こうげきが すりぬけた・・・', damage: 0 };
        }
    },
    
    toriel: {
        id: 'toriel',
        name: 'トリエル',
        hp: 440, maxHp: 440,
        atk: 80, def: 80,
        exp: 200, gold: 0,
        sprite: '🐐',
        canFlee: false,
        isBoss: true,
        check: '* トリエル - ATK 80 DEF 80\n* ふるい いせきの みちびき。\n  しずかな つよさを もっている。',
        acts: [
            { name: 'チェック', action: 'check' },
            { name: 'はなす', action: 'talk' }
        ],
        attacks: ['toriel_fire_spread', 'toriel_fire_wave'],
        dialogue: ['・・・', 'それでも すすむの？', 'あなたを とめるわ。'],
        flags: { talkCount: 0, spareCount: 0 },
        spareCondition: function(battle) {
            return battle.flags.spareCount >= 24;
        },
        onTalk: function(battle) {
            battle.flags.talkCount = (battle.flags.talkCount || 0) + 1;
            const talks = [
                '* トリエルに はなしかけた。\n* ・・・',
                '* ・・・・・・',
                '* ことばだけでは\n  つたわらないようだ。'
            ];
            return talks[Math.min(battle.flags.talkCount - 1, talks.length - 1)];
        },
        onSpare: function(battle) {
            battle.flags.spareCount = (battle.flags.spareCount || 0) + 1;
            if (battle.flags.spareCount >= 24) {
                battle.spareable = true;
                return '* ・・・わかった。\n  こころは とめられないのね。';
            }
            return null;
        },
        getEffectiveAtk: function(battle) {
            // HPが低いとダメージが減る
            if (battle.player.hp <= 3) return -10;
            return this.atk;
        }
    }
};
