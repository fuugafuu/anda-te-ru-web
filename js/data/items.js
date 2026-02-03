// アイテムデータ
const ITEMS = {
    monster_candy: {
        id: 'monster_candy',
        name: 'モンスターキャンディ',
        type: 'consumable',
        heal: 10,
        desc: '* 「とても あまい」',
        useText: '* モンスターキャンディを たべた。\n* HPが 10 かいふくした！'
    },
    
    spider_donut: {
        id: 'spider_donut',
        name: 'クモのドーナツ',
        type: 'consumable',
        heal: 12,
        desc: '* クモが つくった ドーナツ。',
        useText: '* クモのドーナツを たべた。\n* HPが 12 かいふくした！'
    },
    
    butterscotch_pie: {
        id: 'butterscotch_pie',
        name: 'バタースコッチパイ',
        type: 'consumable',
        heal: 999,
        desc: '* バタースコッチと シナモンの パイ。',
        useText: '* バタースコッチパイを たべた。\n* HPが まんたんに なった！'
    },
    
    nice_cream: {
        id: 'nice_cream',
        name: 'ナイスクリーム',
        type: 'consumable',
        heal: 15,
        desc: '* げんきがでる メッセージつき！',
        useText: '* ナイスクリームを たべた！\n* 「きみは すてきだ！」'
    },
    
    stick: {
        id: 'stick',
        name: 'ぼう',
        type: 'weapon',
        atk: 0,
        desc: '* ただの えだ。',
        equipText: '* ぼうを そうびした。'
    },
    
    toy_knife: {
        id: 'toy_knife',
        name: 'おもちゃのナイフ',
        type: 'weapon',
        atk: 3,
        desc: '* プラスチックの ナイフ。',
        equipText: '* おもちゃのナイフを そうびした。'
    },
    
    tough_glove: {
        id: 'tough_glove',
        name: 'タフグローブ',
        type: 'weapon',
        atk: 5,
        desc: '* ボクシング用の グローブ。',
        equipText: '* タフグローブを そうびした。'
    },
    
    bandage: {
        id: 'bandage',
        name: 'ばんそうこう',
        type: 'armor',
        def: 0,
        heal: 1,
        desc: '* ただの ばんそうこう。',
        equipText: '* ばんそうこうを そうびした。'
    },
    
    faded_ribbon: {
        id: 'faded_ribbon',
        name: 'くすんだリボン',
        type: 'armor',
        def: 3,
        desc: '* いろあせた リボン。',
        equipText: '* くすんだリボンを そうびした。'
    },
    
    manly_bandanna: {
        id: 'manly_bandanna',
        name: 'マンリーバンダナ',
        type: 'armor',
        def: 7,
        desc: '* マッチョマンが つけてそうな バンダナ。',
        equipText: '* マンリーバンダナを そうびした。'
    }
};
