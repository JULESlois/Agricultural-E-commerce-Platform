import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Badge } from '../components/Common';
import { MOCK_SHOP } from '../constants';
import { MockApi } from '../src/mock/mockApi';
import { 
  Search, ShoppingCart, ChevronRight, Filter, 
  ArrowUpDown, ChevronLeft, Store, 
  TrendingUp, List, Package, Heart, Star, ChevronDown, Grid, MapPin
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- [M-03] Dashboard Data ---
const PRICE_DATA = [
  { day: '周一', price: 102.4 },
  { day: '周二', price: 103.1 },
  { day: '周三', price: 102.8 },
  { day: '周四', price: 104.2 },
  { day: '周五', price: 105.5 },
  { day: '周六', price: 104.9 },
  { day: '周日', price: 106.2 },
];

// --- [M-02] Categories Data ---
const CATEGORIES_TREE = [
  { id: 'fruit', name: '新鲜水果', icon: '🍎', children: ['苹果', '柑橘', '葡萄', '热带水果', '梨', '桃子', '瓜类'] },
  { id: 'veg', name: '蔬菜蛋品', icon: '🥦', children: ['叶菜', '根茎', '菌菇', '禽蛋', '葱姜蒜'] },
  { id: 'grain', name: '粮油米面', icon: '🌾', children: ['大米', '面粉', '杂粮', '食用油', '面条'] },
  { id: 'meat', name: '禽畜肉类', icon: '🥩', children: ['猪肉', '牛肉', '羊肉', '禽肉', '内脏'] },
  { id: 'tea', name: '茶叶冲饮', icon: '🍵', children: ['绿茶', '红茶', '花草茶', '冲饮谷物'] },
];

// --- [M-06] Featured Shops Data ---
const FEATURED_SHOPS = [
  { id: 's1', name: '洛川红旗合作社', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1595855739665-667cb5b5c962?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', location: '陕西 延安' },
  { id: 's2', name: '赣南脐橙直发', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', location: '江西 赣州' },
  { id: 's3', name: '寿光绿色蔬菜基地', rating: 5.0, avatar: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', location: '山东 潍坊' },
];

// --- Banner Data ---
const BANNER_SLIDES = [
  { id: 1, image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80', title: '金秋助农 · 产地直发', subtitle: '精选当季好货，满199减50' },
  { id: 2, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', title: '新鲜采摘 · 每日必抢', subtitle: '限时特惠，低至5折起' },
  { id: 3, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80', title: '大宗采购 · 企业专享', subtitle: '一站式集采，通过平台享账期' },
];

// --- Components ---

// [Tabs] Navigation Tabs
export const MallTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const TABS = [
    { id: 'home', label: '商城首页', path: '/mall' },
    { id: 'procurement', label: '大宗采购', path: '/mall/procurement' },
    { id: 'coupons', label: '领券中心', path: '/mall/coupons' },
  ];

  return (
    <div className="fixed top-[60px] left-0 w-full bg-white border-b border-gray-200 z-40 shadow-sm transition-all duration-300">
       <div className="w-full max-w-[1200px] mx-auto px-4 flex overflow-x-auto no-scrollbar gap-8">
          {TABS.map(tab => {
             const isActive = tab.path === '/mall' 
                ? location.pathname === '/mall' || location.pathname === '/mall/list'
                : location.pathname.startsWith(tab.path);
             
             return (
                <button
                   key={tab.id}
                   onClick={() => navigate(tab.path)}
                   className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      isActive ? 'border-[#4CAF50] text-[#4CAF50]' : 'border-transparent text-gray-600 hover:text-[#4CAF50]'
                   }`}
                >
                   {tab.label}
                </button>
             );
          })}
       </div>
    </div>
  );
};

// [Banner] Activity Carousel
const MallBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrent(prev => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mt-6">
        <div className="relative h-[280px] md:h-[320px] rounded-2xl overflow-hidden group shadow-md">
            {BANNER_SLIDES.map((slide, index) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex flex-col justify-center px-12 text-white">
                        <h2 className="text-4xl font-bold mb-2 transform translate-y-0 opacity-100 transition-all duration-700 delay-100">{slide.title}</h2>
                        <p className="text-lg opacity-90 mb-6 transform translate-y-0 transition-all duration-700 delay-200">{slide.subtitle}</p>
                        <button className="w-fit px-6 py-2 bg-[#4CAF50] hover:bg-[#43A047] text-white rounded-full font-medium transition-colors shadow-lg">立即查看</button>
                    </div>
                </div>
            ))}
            
            {/* Controls */}
            <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                onClick={() => setCurrent(prev => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length)}
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                onClick={() => setCurrent(prev => (prev + 1) % BANNER_SLIDES.length)}
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {BANNER_SLIDES.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrent(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? 'w-8 bg-[#4CAF50]' : 'w-2 bg-white/60 hover:bg-white'}`} 
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

// FilterPanel 组件已删除 - 只保留排序功能

// [M-05] Sort Bar
const SortBar = () => {
  return (
    <div className="bg-[#F9F9F9] border border-gray-200 rounded-t-lg p-2 flex justify-between items-center">
      <div className="flex items-center">
        <button className="px-4 py-1.5 bg-white border border-gray-200 text-[#4CAF50] font-medium text-sm rounded-l-sm hover:z-10 relative">综合</button>
        <button className="px-4 py-1.5 bg-white border border-l-0 border-gray-200 text-gray-600 text-sm hover:text-[#4CAF50] hover:z-10 relative">
           销量 <ArrowUpDown size={12} className="inline ml-0.5"/>
        </button>
        <button className="px-4 py-1.5 bg-white border border-l-0 border-gray-200 text-gray-600 text-sm hover:text-[#4CAF50] hover:z-10 relative">
           价格 <ArrowUpDown size={12} className="inline ml-0.5"/>
        </button>
        <button className="px-4 py-1.5 bg-white border border-l-0 border-gray-200 text-gray-600 text-sm rounded-r-sm hover:text-[#4CAF50] hover:z-10 relative">
           新品
        </button>
        
        <div className="ml-6 flex items-center gap-2">
           <input type="text" placeholder="¥" className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-[#4CAF50]"/>
           <span className="text-gray-400">-</span>
           <input type="text" placeholder="¥" className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-[#4CAF50]"/>
        </div>
      </div>

      <div className="flex items-center gap-3 pr-2">
         <span className="text-xs text-gray-500">共 <b className="text-[#212121]">1,204</b> 件商品</span>
         <div className="flex items-center gap-1">
            <span className="text-xs text-[#FF9800]">1</span>
            <span className="text-xs text-gray-400">/ 50</span>
            <button className="p-1 border border-gray-200 bg-white rounded-sm hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={14}/></button>
            <button className="p-1 border border-gray-200 bg-white rounded-sm hover:bg-gray-50"><ChevronRight size={14}/></button>
         </div>
      </div>
    </div>
  );
};

// [M-08] Pagination
const Pagination = () => {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button className="px-3 py-1 border border-gray-200 rounded hover:border-[#4CAF50] hover:text-[#4CAF50] disabled:opacity-50 text-sm bg-white" disabled>上一页</button>
      {[1, 2, 3, 4, 5].map(p => (
        <button 
          key={p} 
          className={`px-3 py-1 border rounded text-sm ${p === 1 ? 'border-[#4CAF50] bg-[#4CAF50] text-white' : 'border-gray-200 bg-white hover:border-[#4CAF50] hover:text-[#4CAF50]'}`}
        >
          {p}
        </button>
      ))}
      <span className="text-gray-400">...</span>
      <button className="px-3 py-1 border border-gray-200 rounded hover:border-[#4CAF50] hover:text-[#4CAF50] text-sm bg-white">10</button>
      <button className="px-3 py-1 border border-gray-200 rounded hover:border-[#4CAF50] hover:text-[#4CAF50] text-sm bg-white">下一页</button>
    </div>
  );
};

// Main Mall Page
export const MallHome: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('fruit');
  const [sort, setSort] = useState<string>('');
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 16;
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setIsError(null);
    try {
      const resp = await MockApi.getProducts({ page, pageSize, sort });
      setItems(prev => [...prev, ...resp.data]);
      setTotal(resp.total);
      setPage(p => p + 1);
    } catch (e: any) {
      setIsError(e);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, sort, isLoading]);

  useEffect(() => {
    setItems([]);
    setPage(1);
  }, [sort]);

  useEffect(() => {
    loadMore();
  }, [sort]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      const hasMore = (page - 1) * pageSize < total;
      if (entry.isIntersecting && hasMore && !isLoading && !isError) {
        loadMore();
      }
    });
    io.observe(node);
    return () => io.disconnect();
  }, [page, pageSize, total, isLoading, isError, loadMore]);

  return (
    <div className="animate-fade-in pb-12 bg-[#F5F5F5] min-h-screen pt-[45px]">
      <MallTabs />
      
      {/* Activity Carousel (Above Grid) */}
      <MallBanner />

      {/* Main Grid Layout: T-Shape + 2 Columns */}
      <div className="w-full max-w-[1200px] mx-auto mt-6 grid grid-cols-12 gap-6 px-4 xl:px-0">
         
         {/* --- Left Column (20%) --- */}
         <div className="col-span-12 lg:col-span-3 lg:col-start-1 space-y-6">
            
            {/* [M-02] Category Sidebar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
               <div className="bg-[#4CAF50] px-4 py-3 font-bold text-white flex items-center gap-2">
                  <List size={18} /> 全部分类
               </div>
               <div className="divide-y divide-gray-100">
                  {CATEGORIES_TREE.map(cat => (
                     <div 
                        key={cat.id}
                        className="group"
                     >
                        <div 
                           className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedCategory === cat.id ? 'text-[#4CAF50] bg-green-50' : 'text-gray-700'}`}
                           onMouseEnter={() => setSelectedCategory(cat.id)}
                        >
                           <div className="flex items-center gap-3">
                              <span className="text-lg">{cat.icon}</span>
                              <span className="font-medium text-sm">{cat.name}</span>
                           </div>
                           <ChevronRight size={14} className="text-gray-300 group-hover:text-[#4CAF50]" />
                        </div>
                        {/* Submenu (Simplified for demo) */}
                        {selectedCategory === cat.id && (
                           <div className="px-4 py-2 bg-gray-50 flex flex-wrap gap-2">
                              {cat.children.map(sub => (
                                 <span key={sub} className="text-xs text-gray-500 hover:text-[#4CAF50] cursor-pointer px-1">{sub}</span>
                              ))}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>

            {/* [M-03] Price Index Dashboard */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
               <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                     <TrendingUp className="text-[#4CAF50]" size={16} />
                     <span>价格指数</span>
                  </div>
                  <span className="text-[10px] text-gray-400">实时更新</span>
               </div>
               <div className="h-32 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={PRICE_DATA}>
                        <defs>
                           <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <XAxis dataKey="day" hide />
                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                        <Tooltip contentStyle={{borderRadius: '4px', fontSize: '12px'}} />
                        <Area type="monotone" dataKey="price" stroke="#4CAF50" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-gray-500">红富士 (烟台)</span>
                  <span className="text-red-500 font-bold flex items-center">
                     106.2 <ArrowUpDown size={10} className="ml-1" />
                  </span>
               </div>
            </div>

            {/* [M-06] Recommended Shops */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
               <div className="font-bold text-gray-800 text-sm mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Store size={16} className="text-[#FF9800]" /> 优质商家
               </div>
               <div className="space-y-4">
                  {FEATURED_SHOPS.map(shop => (
                     <div key={shop.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/mall/shop/${shop.id}`)}>
                        <img src={shop.avatar} className="w-10 h-10 rounded-full bg-gray-200 object-cover border border-gray-100 group-hover:border-[#4CAF50] transition-colors" alt={shop.name} />
                        <div className="flex-1 min-w-0">
                           <h4 className="font-medium text-xs text-gray-800 truncate group-hover:text-[#4CAF50]">{shop.name}</h4>
                           <div className="flex items-center justify-between mt-1">
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><MapPin size={10}/> {shop.location.split(' ')[1]}</span>
                              <div className="text-[10px] text-[#FF9800] flex items-center bg-orange-50 px-1 rounded">
                                 <Star size={8} fill="currentColor" className="mr-1" /> {shop.rating}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* --- Right Column (80%) --- */}
         <div className="col-span-12 lg:col-span-9">
            
            {/* [M-05] Sort Bar - 只保留排序选项 */}
            <div className="bg-[#F9F9F9] border border-gray-200 rounded-t-lg p-2 flex justify-between items-center">
              <div className="flex items-center">
                <button onClick={() => { setSort(''); }} className={`px-4 py-1.5 bg-white border ${sort === '' ? 'text-[#4CAF50]' : 'text-gray-600'} border-gray-200 text-sm rounded-l-sm`}>综合</button>
                <button onClick={() => { setSort('price_desc'); }} className={`px-4 py-1.5 bg-white border border-l-0 ${sort === 'price_desc' ? 'text-[#4CAF50]' : 'text-gray-600'} text-sm`}>价格高到低</button>
                <button onClick={() => { setSort('price_asc'); }} className={`px-4 py-1.5 bg-white border border-l-0 ${sort === 'price_asc' ? 'text-[#4CAF50]' : 'text-gray-600'} text-sm rounded-r-sm`}>价格低到高</button>
              </div>
              <div className="flex items-center gap-3 pr-2">
                <span className="text-xs text-gray-500">已加载 <b className="text-[#212121]">{items.length}</b> / 共 <b className="text-[#212121]">{total}</b></span>
              </div>
            </div>

            {/* [M-07] Masonry Product List */}
            <div className="masonry columns-2 md:columns-3 xl:columns-4 mt-4">
               {items.map(product => (
                  <Card 
                     key={product.id} 
                     variant="interactive" 
                     className="group break-inside-avoid mb-4 flex flex-col h-full border border-gray-200 hover:border-[#4CAF50] hover:shadow-md transition-all duration-300"
                     onClick={() => navigate(`/mall/item/${product.id}`)}
                  >
                     <div className="aspect-square bg-gray-100 relative overflow-hidden rounded-t-lg">
                        <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.title} />
                        {/* Tags Overlay */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                           {product.tags?.slice(0,2).map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-black/60 text-white backdrop-blur-sm rounded-sm">{tag}</span>
                           ))}
                        </div>
                        {/* Hover Actions */}
                        <div className="absolute bottom-[-40px] left-0 w-full bg-[#4CAF50]/90 backdrop-blur-sm p-2 flex justify-center gap-4 transition-all group-hover:bottom-0">
                           <button className="text-white hover:scale-110 transition-transform" title="加入购物车"><ShoppingCart size={18}/></button>
                           <button className="text-white hover:scale-110 transition-transform" title="收藏"><Heart size={18}/></button>
                        </div>
                     </div>
                     <div className="p-3 flex flex-col flex-grow bg-white">
                        <div className="mb-1 text-xs text-gray-400 flex items-center gap-1">
                           <MapPin size={12}/> {product.origin}
                        </div>
                        <h4 className="font-bold text-sm text-[#333] line-clamp-2 mb-auto group-hover:text-[#4CAF50] transition-colors cursor-pointer leading-relaxed">
                           {product.title}
                        </h4>
                        
                        <div className="mt-3 pt-3 border-t border-dashed border-gray-100 flex items-end justify-between">
                           <div>
                              <span className="text-xs text-[#FF5722] font-bold">¥</span>
                              <span className="text-lg text-[#FF5722] font-bold">{product.price.toFixed(2)}</span>
                              <span className="text-xs text-gray-400 ml-1">/ {product.specs?.split('/')[1] || '斤'}</span>
                           </div>
                           <div className="text-xs text-gray-400">已售 {product.stock > 500 ? '1000+' : '200+'}</div>
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                           <Badge color="green">店铺认证</Badge>
                           <span className="text-xs text-blue-500 ml-auto flex items-center gap-0.5 hover:underline cursor-pointer">{product.farmerName} <ChevronRight size={12}/></span>
                        </div>
                     </div>
                  </Card>
               ))}
               {isLoading && Array.from({ length: 6 }).map((_, i) => (
                 <div key={`sk-${i}`} className="h-[240px] bg-white border border-gray-200 rounded-lg mb-4 animate-pulse break-inside-avoid" />
               ))}
               {isError && (
                 <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded mb-4 break-inside-avoid">加载失败，请重试</div>
               )}
               <div ref={sentinelRef} className="h-6" />
            </div>

            <div className="flex justify中心 items-center gap-2 mt-8">
              <button onClick={loadMore} className="px-3 py-1 border border-gray-200 rounded hover:border-[#4CAF50] hover:text-[#4CAF50] text-sm bg-white" disabled={isLoading || (page - 1) * pageSize >= total}>{(page - 1) * pageSize >= total ? '已到底' : isLoading ? '加载中' : '加载更多'}</button>
            </div>
        </div>
      </div>
    </div>
  );
};
