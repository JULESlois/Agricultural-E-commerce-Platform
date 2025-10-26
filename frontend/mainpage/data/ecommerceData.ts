import type { Category, Seller, Product, Review } from '../types';

export const categories: Category[] = [
    { id: 'cat1', name: '时令水果', imageUrl: 'https://picsum.photos/300/200?image=1080' },
    { id: 'cat2', name: '新鲜蔬菜', imageUrl: 'https://picsum.photos/300/200?image=821' },
    { id: 'cat3', name: '禽畜肉蛋', imageUrl: 'https://picsum.photos/300/200?image=572' },
    { id: 'cat4', name: '海鲜水产', imageUrl: 'https://picsum.photos/300/200?image=550' },
    { id: 'cat5', name: '粮油调味', imageUrl: 'https://picsum.photos/300/200?image=225' },
    { id: 'cat6', name: '地方特产', imageUrl: 'https://picsum.photos/300/200?image=312' },
];

export const sellers: { [key: string]: Seller } = {
    'seller1': {
        id: 'seller1',
        name: '王大伯的有机农场',
        avatarUrl: 'https://picsum.photos/200/200?image=1012',
        rating: 4.9,
        totalSales: 1250,
        location: '山东 潍坊',
        storeBio: '我们坚持使用有机肥料，为您提供最健康、最天然的蔬菜水果。'
    },
    'seller2': {
        id: 'seller2',
        name: '李家果园直销',
        avatarUrl: 'https://picsum.photos/200/200?image=1027',
        rating: 4.8,
        totalSales: 3400,
        location: '陕西 延安',
        storeBio: '正宗延安红富士，自家果园，产地直发，不打蜡不催熟！'
    },
};

const reviews: { [key: string]: Review[] } = {
    'prod1': [
        { id: 'r1', author: '爱吃水果的小明', rating: 5, comment: '苹果收到了，非常新鲜，又脆又甜，家里人都很喜欢吃！', date: '2023-11-20' },
        { id: 'r2', author: '购物达人', rating: 5, comment: '包装很好，没有一个坏果，个头也很大，会回购的。', date: '2023-11-18' },
    ],
    'prod2': [
        { id: 'r3', author: '美食家莉莉', rating: 5, comment: '这个西红柿味道太正了，有小时候的味道，炒菜凉拌都好吃。', date: '2023-11-21' },
    ],
};

export const products: Product[] = [
    {
        id: 'prod1',
        name: '【产地直供】陕西延安红富士苹果 5kg 礼盒装',
        price: 88.00,
        originalPrice: 108.00,
        imageUrl: 'https://picsum.photos/400/400?image=210',
        images: [
            'https://picsum.photos/800/800?image=210',
            'https://picsum.photos/800/800?image=211',
            'https://picsum.photos/800/800?image=212',
            'https://picsum.photos/800/800?image=214',
        ],
        description: '来自革命圣地延安的红富士苹果，海拔高，光照足，温差大，积累了充足的糖分。果实色泽红润，口感清脆，甜中带酸，是您家庭分享和佳节送礼的优选。',
        sellerId: 'seller2',
        categoryId: 'cat1',
        stock: 150,
        shippingInfo: {
            origin: '陕西 延安',
            deliveryTime: '72小时内发货',
            guarantees: ['坏果包赔', '假一赔十', '产地直采'],
        },
        specs: {
            '品牌': '李家果园',
            '净含量': '5kg',
            '果径': '80-85mm',
            '包装方式': '礼盒装',
        },
        reviews: reviews['prod1'],
    },
    {
        id: 'prod2',
        name: '【有机认证】山东农家自然熟沙瓤西红柿 2.5kg',
        price: 35.50,
        imageUrl: 'https://picsum.photos/400/400?image=1080',
        images: ['https://picsum.photos/800/800?image=1080'],
        description: '王大伯农场出品，坚持自然农法种植，不使用任何化学催熟剂。西红柿果肉饱满，沙瓤多汁，酸甜可口，是您餐桌上的健康选择。',
        sellerId: 'seller1',
        categoryId: 'cat2',
        stock: 88,
        shippingInfo: {
            origin: '山东 潍坊',
            deliveryTime: '48小时内发货',
            guarantees: ['有机认证', '坏果包赔'],
        },
        specs: {
            '品牌': '王大伯的有机农场',
            '净含量': '2.5kg',
        },
        reviews: reviews['prod2'],
    },
    {
        id: 'prod3',
        name: '【正宗走地鸡】农家散养土鸡 净重1.2kg/只',
        price: 128.00,
        imageUrl: 'https://picsum.photos/400/400?image=638',
        images: ['https://picsum.photos/800/800?image=638'],
        description: '在山林间自由奔跑长大的走地鸡，肉质紧实，味道鲜美，鸡汤浓郁。无论是炖汤还是白切，都是一道美味佳肴。',
        sellerId: 'seller1',
        categoryId: 'cat3',
        stock: 50,
        shippingInfo: {
            origin: '山东 潍坊',
            deliveryTime: '下单后现宰，72小时内发货',
            guarantees: ['正宗土鸡', '真空包装'],
        },
        specs: {
            '品牌': '王大伯的有机农场',
            '净含量': '约1.2kg',
        },
        reviews: [],
    },
    {
        id: 'prod4',
        name: '【新品上市】新疆阿克苏冰糖心苹果 5kg',
        price: 99.00,
        imageUrl: 'https://picsum.photos/400/400?image=995',
        images: ['https://picsum.photos/800/800?image=995'],
        description: '来自新疆阿克苏核心产区，果核部分有独特的糖心结晶。果皮薄，肉质细，汁多无渣，甜度极高。',
        sellerId: 'seller2',
        categoryId: 'cat1',
        stock: 200,
        shippingInfo: {
            origin: '新疆 阿克苏',
            deliveryTime: '72小时内发货',
            guarantees: ['坏果包赔', '假一赔十'],
        },
        specs: {
            '品牌': '李家果园',
            '净含量': '5kg',
        },
        reviews: [],
    }
];
