import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_SHOP, MOCK_PRODUCTS, MOCK_COUPONS } from '../constants';
import { MapPin, Star, UserPlus, MessageCircle, Search, Filter, Check, ShieldCheck, Image as ImageIcon, Ticket } from 'lucide-react';

export const ShopProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const shop = MOCK_SHOP; // Use mock data
  const [activeTab, setActiveTab] = useState<'home' | 'all' | 'promo' | 'profile'>('home');
  const [isFollowing, setIsFollowing] = useState(false);
  const [shopSearch, setShopSearch] = useState('');

  // [S-01] Shop Header & [S-02] Navigation
  const renderHeader = () => (
    <div className="bg-white rounded-b-xl shadow-sm mb-6 overflow-hidden">
      {/* Banner Background - 150px Height */}
      <div className="h-[150px] w-full bg-gray-200 relative">
         <img src={shop.bannerUrl} alt="Shop Banner" className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="px-6 relative">
         <div className="flex flex-col md:flex-row items-end -mt-10 mb-4 gap-6">
            {/* Avatar - 80px Square */}
            <div className="w-[80px] h-[80px] bg-white p-1 rounded-lg shadow-md z-10 flex-shrink-0">
               <img src={shop.avatarUrl} alt="Shop Avatar" className="w-full h-full object-cover rounded" />
            </div>

            {/* Shop Info */}
            <div className="flex-1 w-full md:w-auto pt-2 md:pt-0 pb-2">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                     <h1 className="text-2xl font-bold text-[#212121] flex items-center gap-2 mb-1">
                        {shop.name}
                        {shop.isCertified && <Badge color="green">金牌农户</Badge>}
                     </h1>
                     {/* Stats Row */}
                     <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex gap-3">
                           <span>描述 <b className="text-[#FF9800]">4.9</b></span>
                           <span>物流 <b className="text-[#FF9800]">4.8</b></span>
                           <span>服务 <b className="text-[#FF9800]">4.9</b></span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span>粉丝 <b className="text-[#212121]">{shop.followers}</b></span>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                     <Button 
                        variant={isFollowing ? 'ghost' : 'solid-green'} 
                        size="sm"
                        className={isFollowing ? "text-gray-500 border-gray-300" : ""}
                        icon={isFollowing ? <Check size={16}/> : <UserPlus size={16}/>}
                        onClick={() => setIsFollowing(!isFollowing)}
                     >
                        {isFollowing ? '已关注' : '关注店铺'}
                     </Button>
                     <Button 
                        variant="ghost" 
                        size="sm"
                        icon={<MessageCircle size={16}/>}
                        onClick={() => window.dispatchEvent(new Event('open-chat'))}
                     >
                        联系客服
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         {/* [S-02] Navigation Tabs */}
         <div className="flex border-t border-gray-100 overflow-x-auto no-scrollbar">
            {[
               { id: 'home', label: '首页' },
               { id: 'all', label: '全部商品' },
               { id: 'promo', label: '促销活动' },
               { id: 'profile', label: '店铺档案' }
            ].map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                     activeTab === tab.id 
                     ? 'border-[#4CAF50] text-[#4CAF50]' 
                     : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
               >
                  {tab.label}
               </button>
            ))}
         </div>
      </div>
    </div>
  );

  // Tab Content Renderers
  const renderHome = () => (
     <div className="space-y-8 animate-fade-in">
        {/* [S-03] Featured / Recommendations */}
        <section>
           <SectionTitle title="店长推荐" />
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {MOCK_PRODUCTS.slice(0, 3).map((product, idx) => (
                 <Card 
                    key={product.id} 
                    variant="interactive" 
                    className="group"
                    onClick={() => navigate(`/mall/item/${product.id}`)}
                 >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
                       <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.title} />
                       {idx === 0 && <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">镇店之宝</div>}
                    </div>
                    <div className="p-4">
                       <h4 className="font-bold text-gray-800 line-clamp-1 mb-2 group-hover:text-[#4CAF50]">{product.title}</h4>
                       <div className="flex justify-between items-center">
                          <span className="text-[#FF9800] font-bold text-lg">¥{product.price}</span>
                          <Button size="sm" variant="ghost" className="h-7 px-2">购买</Button>
                       </div>
                    </div>
                 </Card>
              ))}
           </div>
        </section>

        <section>
           <div className="flex justify-between items-center mb-4">
              <SectionTitle title="当季热卖" />
              <Button variant="text" size="sm" onClick={() => setActiveTab('all')}>查看全部 &rarr;</Button>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOCK_PRODUCTS.slice(2, 6).map(product => (
                 <Card key={product.id} variant="interactive" onClick={() => navigate(`/mall/item/${product.id}`)}>
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                       <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.title} />
                    </div>
                    <div className="p-3">
                       <h4 className="font-medium text-sm mb-1 line-clamp-1">{product.title}</h4>
                       <div className="font-bold text-[#FF9800]">¥{product.price}</div>
                    </div>
                 </Card>
              ))}
           </div>
        </section>
     </div>
  );

  const renderAllProducts = () => (
     <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
        {/* Sidebar Categories */}
        <div className="space-y-4">
           <Card className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                 <Filter size={16} /> 商品分类
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                 <li className="flex justify-between items-center p-2 bg-green-50 text-[#4CAF50] rounded cursor-pointer font-medium">
                    <span>全部商品</span>
                    <span className="text-xs bg-white px-1.5 rounded-full">{MOCK_PRODUCTS.length}</span>
                 </li>
                 {['当季鲜果', '蔬菜及制品', '粮油米面', '特产礼盒'].map(cat => (
                    <li key={cat} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                       <span>{cat}</span>
                       <span className="text-xs text-gray-400">0</span>
                    </li>
                 ))}
              </ul>
           </Card>
        </div>

        {/* Product List */}
        <div className="lg:col-span-3 space-y-4">
           {/* [S-04] In-shop Search */}
           <div className="bg-white p-3 rounded-lg border border-gray-200 flex gap-2">
              <div className="relative flex-1">
                 <input 
                    type="text" 
                    placeholder="搜索本店商品..." 
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                 />
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <Button size="sm" variant="solid-green">搜索</Button>
           </div>

           <div className="flex gap-4 text-sm font-medium border-b border-gray-100 pb-2 mb-4">
              <button className="text-[#4CAF50]">综合排序</button>
              <button className="text-gray-500 hover:text-gray-800">销量</button>
              <button className="text-gray-500 hover:text-gray-800">价格</button>
              <button className="text-gray-500 hover:text-gray-800">上新</button>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MOCK_PRODUCTS.filter(p => p.title.includes(shopSearch)).map(product => (
                 <Card key={product.id} variant="interactive" onClick={() => navigate(`/mall/item/${product.id}`)}>
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                       <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.title} />
                    </div>
                    <div className="p-3">
                       <h4 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2">{product.title}</h4>
                       <div className="flex justify-between items-end">
                          <span className="text-[#FF9800] font-bold">¥{product.price}</span>
                          <span className="text-xs text-gray-400">已售{product.stock > 100 ? '200+' : '50+'}</span>
                       </div>
                    </div>
                 </Card>
              ))}
           </div>
        </div>
     </div>
  );

  const renderPromo = () => (
     <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-100 text-center">
           <h3 className="text-red-600 font-bold text-lg mb-2">店铺优惠券</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {MOCK_COUPONS.filter(c => c.type === 'SHOP').map(coupon => (
                 <div key={coupon.id} className="bg-white border border-red-100 rounded-lg p-4 flex items-center shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500"></div>
                    <div className="flex-1 text-left">
                       <div className="text-2xl font-bold text-red-500">¥{coupon.amount}</div>
                       <div className="text-xs text-gray-500">满 {coupon.minSpend} 使用</div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-red-500 border-red-200 hover:bg-red-50">立即领取</Button>
                 </div>
              ))}
              {/* Dummy Coupons */}
              <div className="bg-white border border-red-100 rounded-lg p-4 flex items-center shadow-sm relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500"></div>
                 <div className="flex-1 text-left">
                    <div className="text-2xl font-bold text-red-500">9折</div>
                    <div className="text-xs text-gray-500">全店通用折扣券</div>
                 </div>
                 <Button size="sm" variant="ghost" className="text-red-500 border-red-200 hover:bg-red-50">立即领取</Button>
              </div>
           </div>
        </div>
        
        <SectionTitle title="限时特惠" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {MOCK_PRODUCTS.slice(0, 2).map(product => (
              <Card key={product.id} variant="interactive" onClick={() => navigate(`/mall/item/${product.id}`)}>
                 <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.title} />
                    <div className="absolute bottom-0 w-full bg-red-600/90 text-white text-xs py-1 text-center">限时 8.8 折</div>
                 </div>
                 <div className="p-3">
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">{product.title}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-red-600 font-bold">¥{(product.price * 0.88).toFixed(2)}</span>
                       <span className="text-xs text-gray-400 line-through">¥{product.price}</span>
                    </div>
                 </div>
              </Card>
           ))}
        </div>
     </div>
  );

  const renderProfile = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        <div className="space-y-6">
           {/* [S-05] License Info */}
           <Card className="p-6">
              <SectionTitle title="主体信息" />
              <div className="space-y-4 text-sm">
                 <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">企业名称</span>
                    <span className="font-bold text-gray-800">{shop.name}</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">法定代表人</span>
                    <span className="text-gray-800">张**</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">所在地</span>
                    <span className="text-gray-800">{shop.location}</span>
                 </div>
                 <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-500">资质认证</span>
                    <div className="flex gap-2">
                       <Badge color="blue">营业执照</Badge>
                       <Badge color="green">食品经营许可证</Badge>
                    </div>
                 </div>
                 <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400">
                    <ShieldCheck size={48} className="mb-2 opacity-20" />
                    <span className="text-xs">证照信息已通过平台核验</span>
                 </div>
              </div>
           </Card>

           {/* Map Location */}
           <Card className="p-6">
              <SectionTitle title="基地位置" />
              <div className="w-full h-48 bg-blue-50 rounded-lg flex items-center justify-center relative overflow-hidden border border-blue-100">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover"></div>
                 <div className="z-10 flex flex-col items-center text-[#1976D2]">
                    <MapPin size={32} className="mb-1 drop-shadow-md" fill="currentColor" stroke="white" />
                    <span className="font-bold text-sm bg-white/80 px-2 py-1 rounded shadow-sm">{shop.location}</span>
                 </div>
              </div>
           </Card>
        </div>

        <div className="space-y-6">
           {/* Real Photos */}
           <Card className="p-6">
              <SectionTitle title="农场实景" />
              <div className="grid grid-cols-2 gap-4">
                 {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity relative group">
                       <img src={`https://picsum.photos/300/200?random=${i+10}`} className="w-full h-full object-cover" alt="Farm" />
                       <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ImageIcon size={24} />
                       </div>
                    </div>
                 ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">所有照片均为实地拍摄，盗图必究</p>
           </Card>

           {/* Description */}
           <Card className="p-6">
              <SectionTitle title="店铺简介" />
              <p className="text-gray-600 text-sm leading-relaxed">
                 {shop.description}
                 <br/><br/>
                 我们坚持“生态种植，源头直供”的理念，所有产品均来自自有基地和合作农户，全程可追溯。欢迎各位新老客户选购，我们将竭诚为您服务！
              </p>
           </Card>
        </div>
     </div>
  );

  return (
    <div className="animate-fade-in pb-8">
      {renderHeader()}
      
      <div className="mt-6">
         {activeTab === 'home' && renderHome()}
         {activeTab === 'all' && renderAllProducts()}
         {activeTab === 'promo' && renderPromo()}
         {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};