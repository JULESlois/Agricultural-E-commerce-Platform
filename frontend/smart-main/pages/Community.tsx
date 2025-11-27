import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Share2, TrendingUp, Users, Image, Video, HelpCircle, MoreVertical, Flame } from 'lucide-react';
import { Button, Card, Badge, SectionTitle } from '../components/Common';

// Mock 数据
const MOCK_POSTS = [
  {
    id: '1',
    author: {
      name: '老李',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      tag: '金牌农户',
      tagColor: 'orange'
    },
    title: '今年苹果价格咋样？大家都卖多少钱一斤？',
    content: '我这边山东烟台的红富士，现在收购价3.5元/斤，比去年低了不少。想问问其他地区的朋友们，你们那边什么行情？',
    images: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop'
    ],
    topic: '苹果种植交流',
    time: '2小时前',
    likes: 128,
    comments: 45,
    shares: 12,
    isLiked: false
  },
  {
    id: '2',
    author: {
      name: '张农技师',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      tag: '农业专家',
      tagColor: 'green'
    },
    title: '草莓育苗期管理要点分享',
    content: '最近很多朋友问草莓育苗的问题，我总结了几个关键点：1. 温度控制在20-25度 2. 保持土壤湿润但不积水 3. 及时摘除老叶...',
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop'
    ],
    topic: '草莓育苗技巧',
    time: '5小时前',
    likes: 256,
    comments: 89,
    shares: 34,
    isLiked: true
  },
  {
    id: '3',
    author: {
      name: '王大拿',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
      tag: '种植大户',
      tagColor: 'blue'
    },
    title: '',
    content: '今天去地里看了看，小麦长势不错！今年应该是个丰收年 💪',
    images: [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop'
    ],
    topic: '小麦种植',
    time: '1天前',
    likes: 89,
    comments: 23,
    shares: 5,
    isLiked: false
  }
];

const HOT_TOPICS = [
  { id: '1', name: '2025粮补政策', heat: '1.2w', icon: '🔥' },
  { id: '2', name: '山东大葱涨价', heat: '8k', icon: '📈' },
  { id: '3', name: '草莓育苗技巧', heat: '5k', icon: '🍓' },
  { id: '4', name: '有机肥使用经验', heat: '3.2k', icon: '🌱' },
  { id: '5', name: '病虫害防治', heat: '2.8k', icon: '🐛' }
];

const ACTIVE_EXPERTS = [
  {
    id: '1',
    name: '李田',
    title: '高级农艺师',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    posts: 128
  },
  {
    id: '2',
    name: '张教授',
    title: '土壤专家',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
    posts: 256
  }
];

// 发帖触发器组件
const EditorTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Card variant="solid" className="p-4 mb-4">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        <Users size={20} className="text-gray-500" />
      </div>
      <button 
        onClick={onClick}
        className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-2 text-left text-[#9E9E9E] hover:bg-[#EEEEEE] transition-colors"
      >
        分享今天的耕作心得...
      </button>
    </div>
    <div className="flex gap-4 pl-13">
      <button className="flex items-center gap-1 text-sm text-[#757575] hover:text-[#FF9800] transition-colors">
        <Image size={18} />
        <span>发图片</span>
      </button>
      <button className="flex items-center gap-1 text-sm text-[#757575] hover:text-[#FF9800] transition-colors">
        <Video size={18} />
        <span>发视频</span>
      </button>
      <button className="flex items-center gap-1 text-sm text-[#757575] hover:text-[#FF9800] transition-colors">
        <HelpCircle size={18} />
        <span>提问</span>
      </button>
    </div>
  </Card>
);

// 帖子卡片组件
const PostCard: React.FC<{ post: typeof MOCK_POSTS[0] }> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <Card variant="solid" className="p-4 mb-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#212121]">{post.author.name}</span>
              <Badge color={post.author.tagColor as any}>{post.author.tag}</Badge>
            </div>
            <span className="text-xs text-[#9E9E9E]">{post.time}</span>
          </div>
        </div>
        <button className="text-[#9E9E9E] hover:text-[#212121]">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-3">
        {post.title && <h3 className="text-lg font-bold mb-2 text-[#212121]">{post.title}</h3>}
        <p className="text-[#424242] leading-relaxed">{post.content}</p>
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <div className={`grid gap-2 mb-3 ${
          post.images.length === 1 ? 'grid-cols-1' : 
          post.images.length === 2 ? 'grid-cols-2' : 
          'grid-cols-3'
        }`}>
          {post.images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt="" 
              className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            />
          ))}
        </div>
      )}

      {/* Topic Tag */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
          #{post.topic}#
        </span>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-around border-t border-[#E0E0E0] pt-3">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${
            isLiked ? 'text-[#FF9800]' : 'text-[#757575] hover:text-[#FF9800]'
          }`}
        >
          <ThumbsUp size={18} fill={isLiked ? '#FF9800' : 'none'} />
          <span className="text-sm">{likes}</span>
        </button>
        <button className="flex items-center gap-2 text-[#757575] hover:text-[#4CAF50] transition-colors">
          <MessageCircle size={18} />
          <span className="text-sm">{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 text-[#757575] hover:text-[#1976D2] transition-colors">
          <Share2 size={18} />
          <span className="text-sm">{post.shares}</span>
        </button>
      </div>
    </Card>
  );
};

// 热门话题组件
const HotTopics: React.FC = () => (
  <Card variant="solid" className="p-4 mb-4">
    <div className="flex items-center gap-2 mb-4">
      <TrendingUp size={20} className="text-[#FF9800]" />
      <h3 className="font-bold text-[#212121]">热门话题</h3>
    </div>
    <div className="space-y-3">
      {HOT_TOPICS.map((topic, idx) => (
        <Link 
          key={topic.id}
          to={`/community/topic/${topic.id}`}
          className="flex items-center justify-between hover:bg-[#F5F5F5] p-2 rounded transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{topic.icon}</span>
            <span className="text-sm text-[#212121]">#{topic.name}#</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={14} className="text-[#FF9800]" />
            <span className="text-xs text-[#9E9E9E]">{topic.heat}</span>
          </div>
        </Link>
      ))}
    </div>
  </Card>
);

// 活跃专家组件
const ActiveExperts: React.FC = () => (
  <Card variant="solid" className="p-4">
    <div className="flex items-center gap-2 mb-4">
      <Users size={20} className="text-[#4CAF50]" />
      <h3 className="font-bold text-[#212121]">活跃专家</h3>
    </div>
    <div className="space-y-3">
      {ACTIVE_EXPERTS.map(expert => (
        <Link 
          key={expert.id}
          to={`/knowledge/expert/${expert.id}`}
          className="flex items-center gap-3 hover:bg-[#F5F5F5] p-2 rounded transition-colors"
        >
          <img src={expert.avatar} alt={expert.name} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <div className="font-medium text-sm text-[#212121]">{expert.name}</div>
            <div className="text-xs text-[#9E9E9E]">{expert.title}</div>
          </div>
          <div className="text-xs text-[#9E9E9E]">{expert.posts}帖</div>
        </Link>
      ))}
    </div>
  </Card>
);

// 主组件
export const CommunityHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recommend' | 'follow' | 'qa'>('recommend');
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-[120px]">
            <Card variant="solid" className="p-4 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <Users size={24} className="text-gray-500" />
                </div>
                <div>
                  <div className="font-bold text-[#212121]">张三</div>
                  <div className="text-xs text-[#9E9E9E]">农户</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="font-bold text-[#212121]">23</div>
                  <div className="text-xs text-[#9E9E9E]">帖子</div>
                </div>
                <div>
                  <div className="font-bold text-[#212121]">156</div>
                  <div className="text-xs text-[#9E9E9E]">关注</div>
                </div>
                <div>
                  <div className="font-bold text-[#212121]">89</div>
                  <div className="text-xs text-[#9E9E9E]">粉丝</div>
                </div>
              </div>
            </Card>

            <Card variant="solid" className="p-4">
              <h3 className="font-bold text-[#212121] mb-3">社区导航</h3>
              <nav className="space-y-2">
                {['推荐', '热门', '种植圈', '市场行情', '政策解读'].map(item => (
                  <button 
                    key={item}
                    className="w-full text-left px-3 py-2 rounded hover:bg-[#F5F5F5] text-sm text-[#424242] transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            <EditorTrigger onClick={() => setShowPostModal(true)} />

            {/* Tabs */}
            <div className="flex gap-4 mb-4 border-b border-[#E0E0E0]">
              {[
                { key: 'recommend', label: '推荐' },
                { key: 'follow', label: '关注' },
                { key: 'qa', label: '问答' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`pb-3 px-2 font-medium transition-colors relative ${
                    activeTab === tab.key 
                      ? 'text-[#FF9800]' 
                      : 'text-[#757575] hover:text-[#212121]'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF9800]"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Post List */}
            <div>
              {MOCK_POSTS.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-6">
              <Button variant="ghost">加载更多</Button>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-[120px]">
              <HotTopics />
              <ActiveExperts />
            </div>
          </aside>
        </div>
      </div>

      {/* Post Modal Placeholder */}
      {showPostModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPostModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-[600px] w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">发布动态</h2>
            <textarea 
              className="w-full border border-[#E0E0E0] rounded p-3 min-h-[150px] focus:outline-none focus:border-[#FF9800]"
              placeholder="分享你的农业趣事或种植难题..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setShowPostModal(false)}>取消</Button>
              <Button variant="solid-green">发布</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
