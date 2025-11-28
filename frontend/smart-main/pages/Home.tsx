import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_PRODUCTS } from '../constants';
import { 
  ShoppingBag, Landmark, GraduationCap, Users, 
  ChevronRight, Bell, User, Calendar, TrendingUp, 
  ArrowRight, Activity, FileText, ChevronLeft, Store
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Mock Data for Portal ---

const BANNERS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: '数字科技赋能现代农业',
    subtitle: '整合融资、销售、服务三位一体，连接农户与市场的信任桥梁。'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: '金融活水滴灌田间地头',
    subtitle: '纯信用、无抵押、放款快，助力春耕秋收。'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: '庆丰收 · 促和美',
    subtitle: '2025年中国农民丰收节金秋消费季火热开启。'
  }
];

const NEWS_DATA = {
  policy: [
    { id: 1, title: '农业农村部发布《数字农业农村发展规划（2025-2030）》', date: '09-25', isNew: true },
    { id: 2, title: '关于开展2025年农业产业强镇建设的通知', date: '09-24', isNew: false },
    { id: 3, title: '多地出台惠农政策，加大对新型农业经营主体的支持力度', date: '09-22', isNew: false },
    { id: 4, title: '中央财政下达资金支持北方地区冬季清洁取暖', date: '09-20', isNew: false },
    { id: 5, title: '解读：如何申请农机购置补贴？一文读懂', date: '09-18', isNew: false },
  ],
  tech: [
    { id: 1, title: '无人机植保技术在水稻病虫害防治中的应用', date: '09-25', isNew: true },
    { id: 2, title: '新型有机肥对土壤改良效果的实验报告', date: '09-23', isNew: false },
    { id: 3, title: '5G+物联网：智慧大棚的未来已来', date: '09-21', isNew: false },
  ],
  platform: [
    { id: 1, title: '智农链平台累计交易额突破50亿元', date: '09-25', isNew: true },
    { id: 2, title: '关于系统将于9月28日凌晨进行升级维护的公告', date: '09-24', isNew: true },
    { id: 3, title: '智农链入选“2025数字农业优秀案例”', date: '09-20', isNew: false },
  ]
};

const PRICE_SERIES: Record<string, { day: string; price: number; name: string }[]> = {
  白菜: [
    { day: '周一', price: 2.4, name: '白菜' },
    { day: '周二', price: 2.6, name: '白菜' },
    { day: '周三', price: 2.5, name: '白菜' },
    { day: '周四', price: 2.8, name: '白菜' },
    { day: '周五', price: 2.7, name: '白菜' },
    { day: '周六', price: 3.1, name: '白菜' },
    { day: '周日', price: 3.0, name: '白菜' },
  ],
  苹果: [
    { day: '周一', price: 4.2, name: '苹果' },
    { day: '周二', price: 4.1, name: '苹果' },
    { day: '周三', price: 4.3, name: '苹果' },
    { day: '周四', price: 4.5, name: '苹果' },
    { day: '周五', price: 4.4, name: '苹果' },
    { day: '周六', price: 4.6, name: '苹果' },
    { day: '周日', price: 4.5, name: '苹果' },
  ],
  柿子: [
    { day: '周一', price: 3.0, name: '柿子' },
    { day: '周二', price: 3.2, name: '柿子' },
    { day: '周三', price: 3.1, name: '柿子' },
    { day: '周四', price: 3.3, name: '柿子' },
    { day: '周五', price: 3.4, name: '柿子' },
    { day: '周六', price: 3.6, name: '柿子' },
    { day: '周日', price: 3.5, name: '柿子' },
  ],
  西红柿: [
    { day: '周一', price: 2.8, name: '西红柿' },
    { day: '周二', price: 2.9, name: '西红柿' },
    { day: '周三', price: 2.7, name: '西红柿' },
    { day: '周四', price: 2.6, name: '西红柿' },
    { day: '周五', price: 2.7, name: '西红柿' },
    { day: '周六', price: 2.9, name: '西红柿' },
    { day: '周日', price: 3.0, name: '西红柿' },
  ],
};

const PARTNERS = [
  '中国农业银行', '中国建设银行', '顺丰速运', '京东物流', '中国农业大学', '中华全国供销合作总社', '阿里云', '华为云'
];

// --- Sub-components ---

const CountUp: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [activeNewsTab, setActiveNewsTab] = useState<'policy' | 'tech' | 'platform'>('policy');
  const [priceCategory, setPriceCategory] = useState<'白菜' | '苹果' | '柿子' | '西红柿'>('白菜');
  const chartData = PRICE_SERIES[priceCategory];
  
  // Mock User State (Toggle for demo)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col animate-fade-in space-y-12">
      
      {/* [H-01] Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[400px]">
        {/* Left: Carousel (70%) */}
        <div className="lg:col-span-9 relative rounded-xl overflow-hidden shadow-md group h-[300px] lg:h-full">
          {BANNERS.map((banner, index) => (
             <div 
               key={banner.id}
               className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
             >
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 text-white">
                   <h2 className="text-4xl font-bold mb-4 transform translate-y-0 transition-transform duration-700">{banner.title}</h2>
                   <p className="text-xl opacity-90 max-w-2xl">{banner.subtitle}</p>
                   <div className="mt-8">
                      <Button className="bg-[#4CAF50] text-white border-none hover:bg-[#43A047] px-8 rounded-full">
                         了解详情
                      </Button>
                   </div>
                </div>
             </div>
          ))}
          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
             {BANNERS.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentBanner(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-8 bg-[#4CAF50]' : 'w-2 bg-white/50 hover:bg-white'}`}
                />
             ))}
          </div>
          {/* Controls */}
          <button 
             className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
             onClick={() => setCurrentBanner(prev => (prev - 1 + BANNERS.length) % BANNERS.length)}
          >
             <ChevronLeft />
          </button>
          <button 
             className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
             onClick={() => setCurrentBanner(prev => (prev + 1) % BANNERS.length)}
          >
             <ChevronRight />
          </button>
        </div>

        {/* Right: User Panel (30%) */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col overflow-hidden h-[400px]">
           {/* Header */}
           <div className="bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[#4CAF50] p-6 text-white text-center relative">
              <div className="absolute top-2 right-2 cursor-pointer opacity-50 hover:opacity-100" onClick={() => setIsLoggedIn(!isLoggedIn)} title="切换登录状态 (演示用)">
                 <Activity size={16} />
              </div>
              {isLoggedIn ? (
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white p-1 mb-2 shadow-lg">
                       <img src="https://images.unsplash.com/photo-1595855739665-667cb5b5c962?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" className="w-full h-full rounded-full object-cover" alt="User" />
                    </div>
                    <div className="font-bold text-lg">下午好，张三</div>
                    <div className="flex gap-2 mt-1">
                       <Badge color="orange">金牌农户</Badge>
                       <Badge color="blue">LV.5</Badge>
                    </div>
                 </div>
              ) : (
                 <div className="py-2">
                    <h3 className="text-xl font-bold mb-1">欢迎来到智农链</h3>
                    <p className="text-green-100 text-sm">融销一体化数字农业平台</p>
                 </div>
              )}
           </div>

           {/* Content */}
           <div className="flex-1 p-6 flex flex-col">
              {isLoggedIn ? (
                 <div className="flex-1 flex flex-col justify-between">
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                       <div className="bg-gray-50 rounded p-2">
                          <div className="font-bold text-[#212121]">3</div>
                          <div className="text-xs text-gray-500">待发货</div>
                       </div>
                       <div className="bg-gray-50 rounded p-2">
                          <div className="font-bold text-[#212121]">12</div>
                          <div className="text-xs text-gray-500">待付款</div>
                       </div>
                       <div className="bg-gray-50 rounded p-2">
                          <div className="font-bold text-[#212121]">5</div>
                          <div className="text-xs text-gray-500">消息</div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <Button variant="solid-green" className="w-full shadow-green-200" onClick={() => navigate('/mall/seller/dashboard')}>
                          进入工作台
                       </Button>
                       <Button variant="ghost" className="w-full" onClick={() => navigate('/mall/buyer/orders')}>
                          我的订单
                       </Button>
                    </div>
                 </div>
              ) : (
                 <div className="flex-1 flex flex-col justify-center space-y-4">
                    <Button variant="solid-green" size="lg" className="w-full shadow-lg shadow-green-100" onClick={() => navigate('/auth/login')}>
                       <User size={18} className="mr-2" /> 登录 / 注册
                    </Button>
                    
                    <div className="pt-4">
                        <div className="text-xs font-bold text-gray-400 mb-4 text-center flex items-center justify-center gap-2">
                           <span className="h-px w-8 bg-gray-200"></span>
                           快捷入口
                           <span className="h-px w-8 bg-gray-200"></span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                           <button onClick={() => navigate('/mall')} className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                 <ShoppingBag size={20} />
                              </div>
                              <span className="text-xs text-gray-600 font-medium">我要采购</span>
                           </button>
                           <button onClick={() => navigate('/mall/seller/dashboard')} className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                 <Store size={20} />
                              </div>
                              <span className="text-xs text-gray-600 font-medium">我要卖货</span>
                           </button>
                           <button onClick={() => navigate('/finance')} className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                 <Landmark size={20} />
                              </div>
                              <span className="text-xs text-gray-600 font-medium">我要贷款</span>
                           </button>
                        </div>
                    </div>
                 </div>
              )}
              
              {/* Notice List */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-500">平台公告</span>
                    <span className="text-xs text-blue-500 cursor-pointer hover:underline">更多</span>
                 </div>
                 <ul className="space-y-2">
                    {[
                       '关于系统升级维护的通知',
                       '2025年助农贷款利率调整公告',
                    ].map((notice, i) => (
                       <li key={i} className="text-xs text-gray-600 truncate flex items-center gap-1 cursor-pointer hover:text-[#4CAF50]">
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          {notice}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      </section>

      {/* [H-02] Core Services Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
            { title: '产链直销', desc: '源头好货，一站式采购', icon: ShoppingBag, color: 'text-green-600', path: '/mall' },
            { title: '惠农金融', desc: '纯信用贷款，极速放款', icon: Landmark, color: 'text-blue-600', path: '/finance' },
            { title: '专家智库', desc: '农技指导，在线问诊', icon: GraduationCap, color: 'text-orange-600', path: '/knowledge' },
            { title: '用户社区', desc: '经验交流，供需对接', icon: Users, color: 'text-purple-600', path: '/help' },
         ].map((service, idx) => (
            <Card 
               key={idx} 
               variant="interactive" 
               className="p-6 flex items-center gap-4 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg transition-all duration-300 group"
               onClick={() => navigate(service.path)}
            >
               <div className={`p-4 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform duration-300 ${service.color}`}>
                  <service.icon size={32} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-[#212121] mb-1">{service.title}</h3>
                  <p className="text-sm text-gray-500">{service.desc}</p>
               </div>
               <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className="text-gray-400" />
               </div>
            </Card>
         ))}
      </section>

      {/* [H-03] Data Strip */}
      {/* Note: In a real app this might be full width, here we simulate it within the container or break out */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-r from-[#2E7D32] to-[#43A047] text-white py-12 shadow-inner">
         <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {[
               { label: '平台累计成交额', value: 520000, suffix: '+' },
               { label: '服务农户及企业', value: 12400, suffix: '户' },
               { label: '覆盖省市地区', value: 30, suffix: '个' },
               { label: '合作金融机构', value: 56, suffix: '家' },
            ].map((stat, idx) => (
               <div key={idx} className="text-center pt-4 md:pt-0 px-4">
                  <div className="text-4xl md:text-5xl font-bold font-mono mb-2 tracking-tight">
                     <CountUp end={stat.value} />
                     <span className="text-2xl ml-1">{stat.suffix}</span>
                  </div>
                  <div className="text-green-100 text-sm font-medium tracking-widest uppercase">{stat.label}</div>
               </div>
            ))}
         </div>
      </div>

      {/* [H-04] Market Floor */}
      <section>
         <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-bold text-[#212121]">产链直销</h2>
               <div className="hidden md:flex gap-4 text-sm text-gray-500">
                  {['时令水果', '新鲜蔬菜', '粮油米面', '农副加工'].map(cat => (
                     <span key={cat} className="cursor-pointer hover:text-[#4CAF50]">{cat}</span>
                  ))}
               </div>
            </div>
            <Button variant="text" className="text-gray-500 hover:text-[#4CAF50]" onClick={() => navigate('/mall')}>
               查看更多 <ArrowRight size={16} />
            </Button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-auto md:h-[340px]">
            {/* Promo Card (Large) */}
            <div className="md:col-span-1 h-64 md:h-full rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => navigate('/mall')}>
               <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Promo" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="text-yellow-400 font-bold text-lg mb-1">助农扶贫专区</div>
                  <div className="text-white text-sm opacity-90">爱心助农，产地直发</div>
               </div>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
               {MOCK_PRODUCTS.slice(0, 4).map((product) => (
                  <Card 
                     key={product.id} 
                     variant="interactive" 
                     className="flex flex-col h-full group"
                     onClick={() => navigate(`/mall/item/${product.id}`)}
                  >
                     <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
                        <img 
                           src={product.imageUrl} 
                           alt={product.title} 
                           loading="lazy"
                           referrerPolicy="no-referrer"
                           onError={(e) => { e.currentTarget.src = '/assests/logo.png'; e.currentTarget.style.objectFit = 'contain'; e.currentTarget.style.background = '#ffffff'; }}
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                     </div>
                     <div className="p-3 flex flex-col flex-grow">
                        <h3 className="font-bold text-sm text-[#212121] line-clamp-2 mb-2 group-hover:text-[#4CAF50] transition-colors">
                           {product.title}
                        </h3>
                        <div className="mt-auto flex items-center justify-between">
                           <span className="text-lg font-bold text-[#FF9800]">
                              ¥{product.price.toFixed(2)}
                           </span>
                           <span className="text-xs text-gray-400">{product.origin}</span>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>
         </div>
      </section>

      {/* [H-05] News & Charts Floor */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: News Tabs */}
         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
               <div className="flex gap-6">
                  {[
                     { id: 'policy', label: '政策解读' },
                     { id: 'tech', label: '农业科技' },
                     { id: 'platform', label: '平台动态' },
                  ].map(tab => (
                     <button
                        key={tab.id}
                        className={`pb-2 text-lg font-bold transition-colors relative ${activeNewsTab === tab.id ? 'text-[#4CAF50]' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => setActiveNewsTab(tab.id as any)}
                     >
                        {tab.label}
                        {activeNewsTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#4CAF50] rounded-t-full"></span>}
                     </button>
                  ))}
               </div>
               <Button variant="text" size="sm" className="text-gray-400">更多 &rarr;</Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
               {/* Highlight News Image */}
               <div className="w-full md:w-48 h-32 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                  <img src="https://images.unsplash.com/photo-1574943320219-55edeb70ad5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="News" />
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs p-2 truncate">
                     2025年农业产业强镇建设启动
                  </div>
               </div>
               {/* List */}
               <ul className="flex-1 space-y-3">
                  {NEWS_DATA[activeNewsTab].map((news) => (
                     <li key={news.id} className="flex items-start gap-2 group cursor-pointer">
                        <span className="text-gray-300 mt-1.5">•</span>
                        <div className="flex-1">
                           <span className="text-gray-700 text-sm group-hover:text-[#4CAF50] line-clamp-1 transition-colors">{news.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           {news.isNew && <Badge color="red">NEW</Badge>}
                           <span className="text-gray-400 text-xs whitespace-nowrap">{news.date}</span>
                        </div>
                     </li>
                  ))}
               </ul>
            </div>
         </div>

         {/* Right: Price Chart */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-[#1976D2]" size={20} /> 
                  农产品价格指数
               </h3>
               <span className="text-xs text-gray-400">更新于: 09-25</span>
            </div>
            <div className="flex-1 min-h-[200px] w-full text-xs">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                     <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                        itemStyle={{color: '#4CAF50', fontWeight: 'bold'}}
                     />
                     <Area type="monotone" dataKey="price" stroke="#4CAF50" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" name={`${priceCategory}均价`} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs">
               <div className="flex items-center gap-2">
                  <span className="text-gray-500">类别:</span>
                  {(['白菜','苹果','柿子','西红柿'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setPriceCategory(cat)}
                      className={`${priceCategory === cat ? 'bg-green-50 text-green-600 border-green-200' : 'text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600'} px-2 py-1 rounded-full border transition-colors`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
               <div className="flex items-center gap-4">
                 <span className="text-gray-500">今日指数: <b className="text-[#4CAF50]">102.4</b></span>
                 <span className="text-red-500 flex items-center">环比 +0.5% <TrendingUp size={12} className="ml-1"/></span>
               </div>
            </div>
         </div>
      </section>

      {/* [H-06] Partners */}
      <section className="pb-12 border-t border-gray-100 pt-8">
         <h3 className="text-center text-gray-400 font-medium mb-8">———— 合作伙伴 ————</h3>
         <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            {PARTNERS.map((partner, i) => (
               <div key={i} className="text-xl font-bold text-gray-400 hover:text-gray-800 transition-colors cursor-pointer select-none">
                  {partner}
               </div>
            ))}
         </div>
      </section>

    </div>
  );
};

export default Home;
