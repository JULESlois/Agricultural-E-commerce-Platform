import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_COUPONS, MOCK_PRODUCTS } from '../constants';
import { Ticket, Timer, Flame, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export const MallActivity: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in space-y-12">
       {/* Navigation Header */}
       <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/mall')}>
             <ArrowLeft size={16} className="mr-1" /> 返回商城
          </Button>
          <h1 className="text-2xl font-bold text-[#212121]">活动专区 & 领券中心</h1>
       </div>

       {/* Hero Activity Banner */}
       <div className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20">
             <Flame size={200} />
          </div>
          <div className="relative z-10 max-w-xl">
             <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Timer size={16} /> 距活动结束仅剩 08:24:12
             </div>
             <h1 className="text-4xl font-bold mb-4">金秋丰收节 · 限时特惠</h1>
             <p className="text-red-100 text-lg mb-8">精选当季水果、粮油米面，低至 5 折起。助农增收，美味直达。</p>
             <Button variant="solid-blue" className="bg-white text-red-600 hover:bg-gray-100 border-none shadow-md">
                立即抢购
             </Button>
          </div>
       </div>

       {/* Coupon Section (M-07 Preview) */}
       <section>
          <div className="flex justify-between items-center mb-6">
             <SectionTitle title="领券中心" subtitle="先领券，再购物，优惠折上折" />
             <Button variant="text" onClick={() => navigate('/mall/coupons')}>查看全部 <ArrowRight size={16}/></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {MOCK_COUPONS.map(coupon => (
                <div key={coupon.id} className="relative flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-24 bg-gradient-to-br from-[#FF9800] to-orange-600 text-white flex flex-col items-center justify-center p-2">
                      <span className="text-xs">¥</span>
                      <span className="text-3xl font-bold">{coupon.amount}</span>
                   </div>
                   <div className="flex-1 p-3 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                         <Badge color="orange">{coupon.type === 'PLATFORM' ? '平台' : '店铺'}</Badge>
                         <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{coupon.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">满 {coupon.minSpend} 可用</p>
                      <div className="flex justify-between items-center mt-auto">
                         <span className="text-[10px] text-gray-400">{coupon.expiryDate}前有效</span>
                         <Button size="sm" variant={coupon.status === 'CLAIMED' ? 'ghost' : 'solid-green'} className="h-6 px-2 text-xs" disabled={coupon.status === 'CLAIMED'}>
                            {coupon.status === 'CLAIMED' ? '已领取' : '立即领'}
                         </Button>
                      </div>
                   </div>
                   {/* Decorative Circles */}
                   <div className="absolute -top-2 left-[92px] w-4 h-4 bg-[#FAFAFA] rounded-full"></div>
                   <div className="absolute -bottom-2 left-[92px] w-4 h-4 bg-[#FAFAFA] rounded-full"></div>
                </div>
             ))}
          </div>
       </section>

       {/* Flash Sale List */}
       <section>
          <SectionTitle title="限时秒杀" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {MOCK_PRODUCTS.slice(0, 4).map((product, idx) => (
                <Card key={product.id} variant="interactive" className="group" onClick={() => navigate(`/mall/item/${product.id}`)}>
                   <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-lg">
                      <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.title} />
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                         直降 20%
                      </div>
                   </div>
                   <div className="p-4">
                      <h4 className="font-bold text-gray-800 line-clamp-1 mb-2">{product.title}</h4>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                         <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${80 - idx * 10}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                         <span>已抢 {80 - idx * 10}%</span>
                         <span>仅剩 {product.stock}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-lg font-bold text-red-600">¥{(product.price * 0.8).toFixed(2)}</span>
                         <span className="text-xs text-gray-400 line-through">¥{product.price}</span>
                         <Button size="sm" variant="solid-blue" className="ml-auto h-7 bg-red-600 hover:bg-red-700">马上抢</Button>
                      </div>
                   </div>
                </Card>
             ))}
          </div>
       </section>
    </div>
  );
};

// Re-export Coupon Center as a standalone page if needed, but for now it's part of Marketing
export const CouponCenter = () => <MallActivity />;