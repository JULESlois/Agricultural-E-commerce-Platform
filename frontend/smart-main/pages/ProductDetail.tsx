import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_PRODUCTS, MOCK_SHOP } from '../constants';
import { Star, Truck, ShieldCheck, ShoppingCart, Heart, Share2, ChevronRight, Minus, Plus, Store, MessageCircle, GitCompare } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0]; // Fallback for demo
  const [quantity, setQuantity] = useState(1);
  const shop = MOCK_SHOP;

  const handleBuyNow = () => {
    navigate('/mall/checkout');
  };

  const handleAddToCart = () => {
    // In real app, dispatch action
    navigate('/mall/cart');
  };

  const handleOpenChat = () => {
     window.dispatchEvent(new Event('open-chat'));
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#4CAF50]">首页</Link>
        <ChevronRight size={14} className="mx-2" />
        <Link to="/mall" className="hover:text-[#4CAF50]">产链直销</Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-900 font-medium line-clamp-1">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Left */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = '/assests/logo.png'; e.currentTarget.style.objectFit = 'contain'; e.currentTarget.style.background = '#ffffff'; }}
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${i === 0 ? 'border-[#4CAF50]' : 'border-transparent hover:border-gray-200'}`}>
                <img 
                  src={product.imageUrl} 
                  alt="thumbnail" 
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = '/assests/logo.png'; e.currentTarget.style.objectFit = 'contain'; e.currentTarget.style.background = '#ffffff'; }}
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800 text-sm">价格指数</span>
              <span className="text-[10px] text-gray-400">实时更新</span>
            </div>
            <div className="h-32 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={(() => {
                  const t = product.title;
                  if (t.includes('苹果')) return [
                    { day: '周一', price: 4.2 },
                    { day: '周二', price: 4.1 },
                    { day: '周三', price: 4.3 },
                    { day: '周四', price: 4.5 },
                    { day: '周五', price: 4.4 },
                    { day: '周六', price: 4.6 },
                    { day: '周日', price: 4.5 },
                  ];
                  if (t.includes('柿')) return [
                    { day: '周一', price: 3.0 },
                    { day: '周二', price: 3.2 },
                    { day: '周三', price: 3.1 },
                    { day: '周四', price: 3.3 },
                    { day: '周五', price: 3.4 },
                    { day: '周六', price: 3.6 },
                    { day: '周日', price: 3.5 },
                  ];
                  if (t.includes('西红柿')) return [
                    { day: '周一', price: 2.8 },
                    { day: '周二', price: 2.9 },
                    { day: '周三', price: 2.7 },
                    { day: '周四', price: 2.6 },
                    { day: '周五', price: 2.7 },
                    { day: '周六', price: 2.9 },
                    { day: '周日', price: 3.0 },
                  ];
                  return [
                    { day: '周一', price: 2.4 },
                    { day: '周二', price: 2.6 },
                    { day: '周三', price: 2.5 },
                    { day: '周四', price: 2.8 },
                    { day: '周五', price: 2.7 },
                    { day: '周六', price: 3.1 },
                    { day: '周日', price: 3.0 },
                  ];
                })()}>
                  <defs>
                    <linearGradient id="pdColorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '4px', fontSize: '12px'}} />
                  <Area type="monotone" dataKey="price" stroke="#4CAF50" fillOpacity={1} fill="url(#pdColorPrice)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
           <h1 className="text-3xl font-bold text-[#212121] mb-2">{product.title}</h1>
           <div className="flex items-center gap-4 mb-6">
              <div className="flex text-[#FF9800]">
                 {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-sm text-gray-500">4.9分 (200+ 评价)</span>
              <span className="text-sm text-gray-300">|</span>
              <span className="text-sm text-gray-500">销量 1000+</span>
              <span className="text-sm text-gray-300">|</span>
              <button className="text-sm text-blue-600 hover:underline flex items-center gap-1" onClick={() => navigate('/mall/compare')}>
                 <GitCompare size={14} /> 加入对比
              </button>
           </div>

           {/* Price Card */}
           <div className="bg-[#FAFAFA] p-6 rounded-xl mb-6">
              <div className="flex items-end gap-2 mb-2">
                 <span className="text-sm text-[#FF9800] font-bold pb-1">¥</span>
                 <span className="text-4xl font-bold text-[#FF9800] leading-none">{product.price.toFixed(2)}</span>
                 <span className="text-gray-400 text-sm line-through ml-2">¥{(product.price * 1.2).toFixed(2)}</span>
              </div>
              <div className="flex gap-2 mt-4">
                 {product.tags?.map(tag => <Badge key={tag} color="green">{tag}</Badge>)}
              </div>
           </div>

           {/* Attributes */}
           <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center">
                 <span className="text-gray-500 w-20 text-sm">产地</span>
                 <span className="text-[#212121] font-medium">{product.origin}</span>
              </div>
              <div className="flex items-center">
                 <span className="text-gray-500 w-20 text-sm">规格</span>
                 <span className="text-[#212121] font-medium">{product.specs || '标准规格'}</span>
              </div>
              <div className="flex items-center">
                 <span className="text-gray-500 w-20 text-sm">服务</span>
                 <div className="flex gap-4 text-sm text-[#212121]">
                    <span className="flex items-center gap-1"><Truck size={14} /> 48小时发货</span>
                    <span className="flex items-center gap-1"><ShieldCheck size={14} /> 坏果包赔</span>
                 </div>
              </div>
              
              {/* Quantity */}
              <div className="flex items-center pt-4">
                 <span className="text-gray-500 w-20 text-sm">数量</span>
                 <div className="flex items-center border border-gray-200 rounded-md">
                    <button 
                      className="p-2 hover:bg-gray-50 text-gray-500"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="number" 
                      className="w-12 text-center border-none focus:outline-none text-sm" 
                      value={quantity} 
                      readOnly 
                    />
                    <button 
                      className="p-2 hover:bg-gray-50 text-gray-500"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <Plus size={16} />
                    </button>
                 </div>
                 <span className="text-gray-400 text-xs ml-3">库存 {product.stock} 件</span>
              </div>
           </div>

           {/* Actions */}
           <div className="flex gap-4">
              <Button 
                variant="ghost" 
                size="lg" 
                className="flex-1 border-[#4CAF50] text-[#4CAF50]"
                onClick={handleAddToCart}
              >
                加入购物车
              </Button>
              <Button 
                variant="solid-green" 
                size="lg" 
                className="flex-1 text-lg"
                onClick={handleBuyNow}
              >
                立即购买
              </Button>
              <button className="p-3 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500">
                 <Heart size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* Details Tabs & Shop Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="p-0 overflow-hidden">
               <div className="flex border-b border-gray-200 bg-gray-50">
                  <button className="px-6 py-4 font-bold text-[#4CAF50] border-b-2 border-[#4CAF50] bg-white">商品详情</button>
                  <button className="px-6 py-4 font-medium text-gray-500 hover:text-[#212121]">用户评价 (203)</button>
                  <button className="px-6 py-4 font-medium text-gray-500 hover:text-[#212121]">种植追溯</button>
               </div>
               <div className="p-8 min-h-[400px]">
                  <p className="mb-4 text-gray-600 leading-relaxed">
                    这里的{product.title}产自{product.origin}核心产区，采用生态种植方式，不使用化学农药，人工除草，物理防虫。每一个果实都经过精心挑选，保证口感脆甜，汁水丰沛。
                  </p>
                  <div className="space-y-4">
                     <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        商品详情长图占位符
                     </div>
                     <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        种植基地实拍占位符
                     </div>
                  </div>
               </div>
            </Card>
         </div>

         {/* Shop Info Card */}
         <div>
            <Card className="p-6 mb-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <img src={shop.avatarUrl} className="w-12 h-12 rounded bg-gray-200 object-cover" alt="Shop" />
                    <div>
                        <h3 className="font-bold text-gray-800">{shop.name}</h3>
                        <Badge color="green">平台认证</Badge>
                    </div>
                </div>
                <div className="flex justify-between text-center mb-4 text-sm">
                    <div>
                        <div className="font-bold text-gray-700">{shop.rating}</div>
                        <div className="text-gray-400 text-xs">综合评分</div>
                    </div>
                    <div>
                        <div className="font-bold text-gray-700">{shop.followers}</div>
                        <div className="text-gray-400 text-xs">关注人数</div>
                    </div>
                    <div>
                        <div className="font-bold text-gray-700">3年</div>
                        <div className="text-gray-400 text-xs">开店时长</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => navigate(`/mall/shop/${shop.id}`)} icon={<Store size={14}/>}>
                        进店逛逛
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={handleOpenChat} icon={<MessageCircle size={14}/>}>
                        联系客服
                    </Button>
                </div>
            </Card>

            <SectionTitle title="同店推荐" />
            <div className="space-y-4">
               {MOCK_PRODUCTS.filter(p => p.id !== product.id).slice(0, 3).map(p => (
                 <Card key={p.id} variant="interactive" className="flex gap-4 p-3" onClick={() => navigate(`/mall/item/${p.id}`)}>
                    <img src={p.imageUrl} className="w-20 h-20 object-cover rounded" alt={p.title} />
                    <div>
                       <h4 className="text-sm font-bold line-clamp-2 mb-2">{p.title}</h4>
                       <span className="text-[#FF9800] font-bold">¥{p.price}</span>
                    </div>
                 </Card>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
