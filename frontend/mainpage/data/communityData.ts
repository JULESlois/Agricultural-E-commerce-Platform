import type { User, Post, Comment } from '../types';

export const users: { [key: string]: User } = {
    'user1': { id: 'user1', name: '李卫国', avatarUrl: 'https://picsum.photos/200/200?image=1005', handle: '@liweiguo_expert' },
    'user2': { id: 'user2', name: '王大农', avatarUrl: 'https://picsum.photos/200/200?image=1012', handle: '@wangdanong' },
    'user3': { id: 'user3', name: '陈晓琳', avatarUrl: 'https://picsum.photos/200/200?image=1011', handle: '@chenxiaolin_prof' },
    'user4': { id: 'user4', name: '田间小妹', avatarUrl: 'https://picsum.photos/200/200?image=1027', handle: '@farmsis' },
};

const comments: { [key: string]: Comment[] } = {
    'post1': [
        { id: 'c1', user: users['user4'], content: '专家说的太对了！我们家今年就是这么做的，产量确实高了不少。', timestamp: '2 小时前' },
        { id: 'c2', user: users['user2'], content: '感谢分享！正愁不知道怎么选肥料。', timestamp: '1 小时前' },
    ],
    'post2': [
        { id: 'c3', user: users['user1'], content: '看起来不错！注意防治红蜘蛛，这个季节容易爆发。', timestamp: '5 小时前' },
    ],
};

export const posts: Post[] = [
    {
        id: 'post1',
        user: users['user1'],
        content: '【农业知识分享】大家好，关于冬小麦的施肥，有几个关键点需要注意：一是要重施基肥，有机肥和化肥结合；二是要看苗追肥，不同生长阶段需求不同；三是注意微量元素的补充，特别是锌和硼。科学施肥是增产的关键！#农业技术 #冬小麦',
        timestamp: '4 小时前',
        likes: 125,
        comments: comments['post1'],
    },
    {
        id: 'post2',
        user: users['user4'],
        content: '今年的草莓长势喜人！阳光大棚就是给力，预计下个月就能第一批上市啦，希望有个好收成。🍓 #草莓种植 #我的农场日记',
        imageUrl: 'https://picsum.photos/800/600?image=203',
        timestamp: '8 小时前',
        likes: 233,
        comments: comments['post2'],
    },
    {
        id: 'post3',
        user: users['user2'],
        content: '请教各位一个问题，玉米螟虫害有什么环保无公害的防治方法吗？最近地里有点多，不想打农药。',
        timestamp: '昨天',
        likes: 42,
        comments: [],
    },
    {
        id: 'post4',
        user: users['user3'],
        content: '近期农产品价格分析：受天气影响，蔬菜类价格普遍小幅上涨，建议种植户关注市场动态，合理安排出货时间。同时，猪肉价格保持稳定，养殖户可以按计划出栏。#市场分析 #农产品价格',
        timestamp: '2 天前',
        likes: 98,
        comments: [],
    },
];
