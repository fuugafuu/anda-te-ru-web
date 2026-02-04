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
            { x: 620, y: 200, w: 20, h: 80, to: 'ruins_puzzle2', spawnX: 40, spawnY: 240 }
        ],
        decorations: [
            { x: 160, y: 80, w: 80, h: 120, color: '#2a103d' },
            { x: 400, y: 260, w: 90, h: 140, color: '#2a103d' }
        ],
        collision: [
            { x: 160, y: 80, w: 80, h: 120 },
            { x: 400, y: 260, w: 90, h: 140 }
        ]
    },

    ruins_puzzle2: {
        id: 'ruins_puzzle2',
        name: 'ちいさなま',
        area: 'ruins',
        width: 640,
        height: 480,
        music: 'mus_ruins',
        bgColor: '#1c0028',
        spawn: { x: 40, y: 240 },
        npcs: [
            {
                id: 'ruins_guide',
                x: 240,
                y: 200,
                sprite: '📜',
                dialogue: 'ruins_guide'
            }
        ],
        exits: [
            { x: 0, y: 200, w: 20, h: 80, to: 'ruins_puzzle1', spawnX: 580, spawnY: 240 },
            { x: 620, y: 200, w: 20, h: 80, to: 'ruins_bridge', spawnX: 40, spawnY: 240 }
        ],
        decorations: [
            { x: 120, y: 120, w: 90, h: 200, color: '#261038' },
            { x: 420, y: 80, w: 110, h: 160, color: '#261038' }
        ],
        collision: [
            { x: 120, y: 120, w: 90, h: 200 },
            { x: 420, y: 80, w: 110, h: 160 }
        ]
    },

    ruins_bridge: {
        id: 'ruins_bridge',
        name: 'ながいみち',
        area: 'ruins',
        width: 1200,
        height: 320,
        music: 'mus_ruins',
        bgColor: '#1b0022',
        spawn: { x: 40, y: 160 },
        npcs: [
            {
                id: 'ruins_guard',
                x: 480,
                y: 160,
                sprite: '🛡️',
                battleOnInteract: 'ruins_guard'
            },
            {
                id: 'ruins_bridge_hint',
                x: 200,
                y: 120,
                sprite: '💬',
                dialogue: 'ruins_bridge_hint'
            }
        ],
        exits: [
            { x: 0, y: 120, w: 20, h: 80, to: 'ruins_puzzle2', spawnX: 580, spawnY: 240 },
            { x: 1180, y: 120, w: 20, h: 80, to: 'ruins_crossroads', spawnX: 40, spawnY: 160 }
        ],
        decorations: [
            { x: 200, y: 90, w: 160, h: 140, color: '#241030' },
            { x: 620, y: 60, w: 140, h: 200, color: '#241030' },
            { x: 880, y: 110, w: 120, h: 120, color: '#241030' }
        ],
        collision: [
            { x: 200, y: 90, w: 160, h: 140 },
            { x: 620, y: 60, w: 140, h: 200 },
            { x: 880, y: 110, w: 120, h: 120 }
        ]
    },

    ruins_crossroads: {
        id: 'ruins_crossroads',
        name: 'みちのひろば',
        area: 'ruins',
        width: 800,
        height: 480,
        music: 'mus_ruins',
        bgColor: '#1a0024',
        spawn: { x: 40, y: 160 },
        exits: [
            { x: 0, y: 140, w: 20, h: 80, to: 'ruins_bridge', spawnX: 1140, spawnY: 160 },
            { x: 780, y: 140, w: 20, h: 80, to: 'ruins_dummy', spawnX: 40, spawnY: 240 },
            { x: 380, y: 0, w: 40, h: 20, to: 'ruins_garden', spawnX: 320, spawnY: 420 }
        ],
        decorations: [
            { x: 140, y: 220, w: 160, h: 120, color: '#241030' },
            { x: 460, y: 200, w: 160, h: 140, color: '#241030' }
        ],
        collision: [
            { x: 140, y: 220, w: 160, h: 120 },
            { x: 460, y: 200, w: 160, h: 140 }
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
            { x: 0, y: 200, w: 20, h: 80, to: 'ruins_crossroads', spawnX: 740, spawnY: 160 },
            { x: 620, y: 200, w: 20, h: 80, to: 'ruins_hallway', spawnX: 40, spawnY: 240 }
        ],
        decorations: [
            { x: 120, y: 120, w: 120, h: 80, color: '#2a103d' },
            { x: 380, y: 300, w: 120, h: 80, color: '#2a103d' }
        ],
        collision: [
            { x: 120, y: 120, w: 120, h: 80 },
            { x: 380, y: 300, w: 120, h: 80 }
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
            { x: 940, y: 120, w: 20, h: 80, to: 'ruins_garden', spawnX: 40, spawnY: 220 }
        ],
        decorations: [
            { x: 260, y: 60, w: 180, h: 80, color: '#241030' },
            { x: 620, y: 180, w: 160, h: 80, color: '#241030' }
        ],
        collision: [
            { x: 260, y: 60, w: 180, h: 80 },
            { x: 620, y: 180, w: 160, h: 80 }
        ]
    },

    ruins_garden: {
        id: 'ruins_garden',
        name: 'こけのにわ',
        area: 'ruins',
        width: 640,
        height: 480,
        music: 'mus_ruins',
        bgColor: '#1a0026',
        spawn: { x: 40, y: 220 },
        npcs: [
            {
                id: 'ruins_garden_sign',
                x: 300,
                y: 260,
                sprite: '🌿',
                dialogue: 'ruins_garden'
            }
        ],
        exits: [
            { x: 0, y: 200, w: 20, h: 80, to: 'ruins_crossroads', spawnX: 400, spawnY: 40 },
            { x: 620, y: 200, w: 20, h: 80, to: 'ruins_library', spawnX: 40, spawnY: 240 }
        ],
        decorations: [
            { x: 180, y: 140, w: 100, h: 200, color: '#233018' },
            { x: 360, y: 80, w: 120, h: 240, color: '#233018' }
        ],
        collision: [
            { x: 180, y: 140, w: 100, h: 200 },
            { x: 360, y: 80, w: 120, h: 240 }
        ]
    },

    ruins_library: {
        id: 'ruins_library',
        name: 'しずかなへや',
        area: 'ruins',
        width: 640,
        height: 480,
        music: 'mus_ruins',
        bgColor: '#210028',
        spawn: { x: 40, y: 240 },
        npcs: [
            {
                id: 'ruins_storykeeper',
                x: 360,
                y: 240,
                sprite: '🕯️',
                dialogue: 'ruins_library'
            }
        ],
        exits: [
            { x: 0, y: 200, w: 20, h: 80, to: 'ruins_garden', spawnX: 580, spawnY: 220 },
            { x: 620, y: 200, w: 20, h: 80, to: 'ruins_home', spawnX: 320, spawnY: 400 }
        ],
        decorations: [
            { x: 120, y: 90, w: 140, h: 140, color: '#2b1038' },
            { x: 380, y: 240, w: 140, h: 140, color: '#2b1038' }
        ],
        collision: [
            { x: 120, y: 90, w: 140, h: 140 },
            { x: 380, y: 240, w: 140, h: 140 }
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
