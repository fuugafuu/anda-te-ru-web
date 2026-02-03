// ゲーム定数
const GAME = {
    WIDTH: 640,
    HEIGHT: 480,
    FPS: 60,
    TILE_SIZE: 20
};

const GAME_STATE = {
    TITLE: 'title',
    NAME_INPUT: 'name',
    OVERWORLD: 'game',
    BATTLE: 'battle',
    MENU: 'menu',
    GAMEOVER: 'gameover'
};

const BATTLE_PHASE = {
    INTRO: 'intro',
    MENU: 'menu',
    FIGHT: 'fight',
    ACT: 'act',
    ITEM: 'item',
    MERCY: 'mercy',
    ENEMY_TURN: 'enemy',
    TEXT: 'text',
    WIN: 'win',
    LOSE: 'lose'
};

const SOUL_MODE = {
    RED: 'red',
    BLUE: 'blue',
    CYAN: 'cyan',
    ORANGE: 'orange',
    PURPLE: 'purple',
    GREEN: 'green',
    YELLOW: 'yellow'
};

const SOUL = {
    SIZE: 16,
    SPEED: 3,
    GRAVITY: 0.4,
    JUMP_FORCE: -8,
    MAX_FALL: 10
};

const BATTLE = {
    BOX_X: 32,
    BOX_Y: 250,
    BOX_WIDTH: 565,
    BOX_HEIGHT: 130,
    INVINCIBILITY_FRAMES: 60,
    ATTACK_METER_SPEED: 6
};

// LVごとのステータス
const LV_STATS = {
    1: { hp: 20, at: 0, df: 0 },
    2: { hp: 24, at: 2, df: 2 },
    3: { hp: 28, at: 4, df: 4 },
    4: { hp: 32, at: 6, df: 5 },
    5: { hp: 36, at: 8, df: 6 },
    6: { hp: 40, at: 10, df: 7 },
    7: { hp: 44, at: 12, df: 8 },
    8: { hp: 48, at: 14, df: 9 },
    9: { hp: 52, at: 16, df: 10 },
    10: { hp: 56, at: 18, df: 11 },
    11: { hp: 60, at: 20, df: 12 },
    12: { hp: 68, at: 24, df: 14 },
    13: { hp: 76, at: 28, df: 16 },
    14: { hp: 84, at: 32, df: 18 },
    15: { hp: 92, at: 36, df: 20 },
    16: { hp: 96, at: 40, df: 22 },
    17: { hp: 98, at: 44, df: 24 },
    18: { hp: 99, at: 48, df: 26 },
    19: { hp: 99, at: 52, df: 28 },
    20: { hp: 99, at: 99, df: 99 }
};

// LVアップに必要なEXP
const LV_THRESHOLDS = {
    1: 10, 2: 30, 3: 70, 4: 120, 5: 200,
    6: 300, 7: 450, 8: 650, 9: 900, 10: 1200,
    11: 1700, 12: 2500, 13: 3500, 14: 5000, 15: 7000,
    16: 10000, 17: 15000, 18: 25000, 19: 50000
};

// 特殊な名前
const SPECIAL_NAMES = {
    'CHARA': { message: '* しんのなまえ。' },
    'FRISK': { message: '* ・・・このなまえで\n  いいんですか？', preventUse: false },
    'ASRIEL': { message: '* ・・・', preventUse: true },
    'TORIEL': { message: '* このなまえは\n  つかえません。', preventUse: true },
    'SANS': { message: '* いいじかんを\n  すごせそうだ。', preventUse: true },
    'PAPYRU': { message: '* いみがわからない', preventUse: true },
    'UNDYNE': { message: '* うーん・・・？', preventUse: true },
    'ALPHYS': { message: '* ち・・・\n  ちがうよ！', preventUse: true },
    'ASGORE': { message: '* このなまえは\n  つかえません。', preventUse: true },
    'FLOWEY': { message: '* ・・・', preventUse: true },
    'METTA': { message: '* おおおお！！！', preventUse: true },
    'MURDER': { message: '* ・・・', preventUse: false },
    'MERCY': { message: '* ・・・', preventUse: false },
    'GASTER': { message: '* ■□■□■□■□', preventUse: true }
};

// 音楽
const MUSIC = {
    TITLE: 'mus_menu0',
    RUINS: 'mus_ruins',
    HOME: 'mus_home',
    SNOWY: 'mus_snowy',
    SNOWDIN_TOWN: 'mus_town',
    ENEMY_APPROACHING: 'mus_battle1',
    GHOST_FIGHT: 'mus_ghostfight',
    HEARTACHE: 'mus_heartache',
    BONETROUSLE: 'mus_bonetrousle',
    DOGSONG: 'mus_dogsong',
    GAMEOVER: 'mus_gameover'
};

// 効果音
const SFX = {
    SELECT: 'snd_select',
    CONFIRM: 'snd_confirm',
    CANCEL: 'snd_cancel',
    TEXT: 'snd_text',
    SAVE: 'snd_save',
    HEAL: 'snd_heal',
    HURT: 'snd_hurt',
    ATTACK: 'snd_attack',
    DAMAGE: 'snd_damage',
    ENCOUNTER: 'snd_encounter',
    FLEE: 'snd_flee',
    SPARE: 'snd_spare',
    SOUL_BREAK: 'snd_break1'
};
