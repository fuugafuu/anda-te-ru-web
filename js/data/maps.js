// マップデータ
const MAPS = {
    ruins_fall: {
        id: 'ruins_fall',
        name: 'おちてきたばしょ',
        area: 'ruins',
        width: 640,
        height: 480,
        music: null,
        bgColor: '#1a0020',
        spawn: { x: 320, y: 350 },
        exits: [
            { x: 280, y: 0, w: 80, h: 20, to: 'ruins_flowey', spawnX: 320, spawnY: 420 }
        ],
        collision: [
            { x: 0, y: 0, w: 100, h: 480 },
            { x: 540, y: 0, w: 100, h: 480 },
            { x: 120, y: 80, w: 50, h: 240 },
            { x: 470, y: 80, w: 50, h: 240 }
        ]
    },
    
    ruins_flowey: {
        id: 'ruins_flowey',
        name: 'フラウィのへや',
        area: 'ruins',
        width: 640,
        height: 480,
        music: null,
        bgColor: '#1a0020',
        spawn: { x: 320, y: 420 },
        npcs: [
            {
                id: 'flowey',
                x: 320,
                y: 200,
                sprite: '🌻',
                dialogue: 'flowey_intro',
                battleOnEnd: 'flowey_tutorial',
                disappearFlag: 'flowey_intro_done'
            }
        ],
        exits: [
            { x: 280, y: 460, w: 80, h: 20, to: 'ruins_fall', spawnX: 320, spawnY: 50 },
            { x: 280, y: 0, w: 80, h: 20, to: 'ruins_entrance', spawnX: 320, spawnY: 420, requireFlag: 'flowey_intro_done' }
        ],
        collision: [
            { x: 0, y: 0, w: 80, h: 480 },
            { x: 560, y: 0, w: 80, h: 480 },
            { x: 220, y: 120, w: 200, h: 30 }
        ]
    },
    
    ruins_entrance: {
        id: 'ruins_entrance',
        name: 'いせきのいりぐち',
        area: 'ruins',
        width: 640,
        height: 480,
        music: 'mus_ruins',
        bgColor: '#200030',
        spawn: { x: 320, y: 420 },
        savePoint: { x: 100, y: 350 },
        exits: [
            { x: 280, y: 460, w: 80, h: 20, to: 'ruins_flowey', spawnX: 320, spawnY: 50 },
            { x: 600, y: 200, w: 40, h: 80, to: 'ruins_puzzle1', spawnX: 40, spawnY: 240 }
        ]
    },
    
    ruins_puzzle1: {
        id: 'ruins_puzzle1',
        name: 'スイッチパズル',
        area: 'ruins',
        width: 640,
        height: 480,
        music: 'mus_ruins',
        bgColor: '#200030',
        spawn: { x: 40, y: 240 },
        exits: [
            { x: 0, y: 200, w: 20, h: 80, to: 'ruins_entrance', spawnX: 580, spawnY: 240 },
            { x: 620, y: 200, w: 20, h: 80, to: 'ruins_dummy', spawnX: 40, spawnY: 240 }
        ]
    },
    
    ruins_dummy: {
        id: 'ruins_dummy',
        name: 'ダミーのへや',
        area: 'ruins',
        width: 640,
        height: 480,
        music: 'mus_ruins',
        bgColor: '#200030',
        spawn: { x: 40, y: 240 },
        npcs: [
            {
                id: 'dummy',
                x: 320,
                y: 180,
                sprite: '🎭',
                battleOnInteract: 'dummy',
                disappearFlag: 'dummy_defeated'
            },
            {
                id: 'toriel_dummy',
                x: 200,
                y: 350,
                sprite: '🐐',
                dialogue: 'toriel_dummy_hint',
                disappearFlag: 'dummy_defeated'
            }
        ],
        exits: [
            { x: 0, y: 200, w: 20, h: 80, to: 'ruins_puzzle1', spawnX: 580, spawnY: 240 },
            { x: 620, y: 200, w: 20, h: 80, to: 'ruins_hallway', spawnX: 40, spawnY: 240 }
        ]
    },
    
    ruins_hallway: {
        id: 'ruins_hallway',
        name: 'ながいろうか',
        area: 'ruins',
        width: 960,
        height: 320,
        music: 'mus_ruins',
        bgColor: '#200030',
        spawn: { x: 40, y: 160 },
        randomEncounters: ['froggit', 'whimsun'],
        encounterRate: 0.03,
        exits: [
            { x: 0, y: 120, w: 20, h: 80, to: 'ruins_dummy', spawnX: 580, spawnY: 240 },
            { x: 940, y: 120, w: 20, h: 80, to: 'ruins_home', spawnX: 320, spawnY: 400 }
        ]
    },
    
    ruins_home: {
        id: 'ruins_home',
        name: 'トリエルのいえ',
        area: 'ruins',
        width: 640,
        height: 480,
        music: 'mus_home',
        bgColor: '#302010',
        spawn: { x: 320, y: 400 },
        savePoint: { x: 100, y: 350 },
        npcs: [
            {
                id: 'toriel_home',
                x: 200,
                y: 250,
                sprite: '🐐',
                dialogue: 'toriel_home'
            }
        ],
        exits: [
            { x: 280, y: 460, w: 80, h: 20, to: 'ruins_hallway', spawnX: 900, spawnY: 160 },
            { x: 280, y: 100, w: 80, h: 20, to: 'ruins_basement', spawnX: 320, spawnY: 420, requireFlag: 'talked_to_toriel' }
        ]
    },
    
    ruins_basement: {
        id: 'ruins_basement',
        name: 'ちかつうろ',
        area: 'ruins',
        width: 1200,
        height: 320,
        music: 'mus_ruins',
        bgColor: '#150015',
        spawn: { x: 320, y: 160 },
        exits: [
            { x: 0, y: 120, w: 20, h: 80, to: 'ruins_home', spawnX: 320, spawnY: 150 },
            { x: 1180, y: 120, w: 20, h: 80, to: 'ruins_exit', spawnX: 40, spawnY: 240 }
        ]
    },
    
    ruins_exit: {
        id: 'ruins_exit',
        name: 'いせきのでぐち',
        area: 'ruins',
        width: 640,
        height: 480,
        music: null,
        bgColor: '#150015',
        spawn: { x: 40, y: 240 },
        npcs: [
            {
                id: 'toriel_battle',
                x: 320,
                y: 200,
                sprite: '🐐',
                dialogue: 'toriel_battle_intro',
                battleOnEnd: 'toriel',
                disappearFlag: 'toriel_defeated'
            }
        ],
        exits: [
            { x: 0, y: 200, w: 20, h: 80, to: 'ruins_basement', spawnX: 1140, spawnY: 160 },
            { x: 280, y: 0, w: 80, h: 20, to: 'snowdin_entrance', spawnX: 320, spawnY: 420, requireFlag: 'toriel_defeated' }
        ]
    },
    
    snowdin_entrance: {
        id: 'snowdin_entrance',
        name: 'スノーフルのもり',
        area: 'snowdin',
        width: 640,
        height: 480,
        music: 'mus_snowy',
        bgColor: '#102030',
        spawn: { x: 320, y: 420 },
        exits: [
            { x: 280, y: 460, w: 80, h: 20, to: 'ruins_exit', spawnX: 320, spawnY: 50 }
        ]
    }
};
