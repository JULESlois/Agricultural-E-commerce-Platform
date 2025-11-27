import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../components/Common';
import { User, Package, MapPin, CreditCard, Settings } from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[#212121]">个人中心</h1>

      {/* User Info Card */}
      <Card className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6 bg-gradient-to-r from-[#4CAF50]/10 to-transparent border border-[#4CAF50]/20">
         <div className="w-20 h-20 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-sm">
            <User size={40} />
         </div>
         <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
               <h2 className="text-2xl font-bold text-[#212121]">张三</h2>
               <Badge color="green">认证农户</Badge>
               <Badge color="blue">黄金会员</Badge>
            </div>
            <p className="text-gray-500 mb-4">ID: 88392019 | 注册时间: 2023-05-12</p>
            <div className="flex justify-center md:justify-start gap-8">
               <div className="text-center">
                  <div className="text-xl font-bold text-[#212121]">12</div>
                  <div className="text-xs text-gray-500">待发货</div>
               </div>
               <div className="text-center">
                  <div className="text-xl font-bold text-[#212121]">5</div>
                  <div className="text-xs text-gray-500">待收货</div>
               </div>
               <div className="text-center">
                  <div className="text-xl font-bold text-[#212121]">2,340</div>
                  <div className="text-xs text-gray-500">积分</div>
               </div>
            </div>
         </div>
         <div>
            <Button variant="ghost" icon={<Settings size={16} />} onClick={() => navigate('/mall/buyer/settings')}>账号设置</Button>
         </div>
      </Card>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
            { title: '我的订单', icon: Package, color: 'bg-blue-50 text-blue-600', path: '/mall/buyer/orders' },
            { title: '收货地址', icon: MapPin, color: 'bg-orange-50 text-orange-600', path: '/mall/buyer/address' },
            { title: '支付管理', icon: CreditCard, color: 'bg-purple-50 text-purple-600', path: '/mall/buyer/payment' },
         ].map((item, idx) => (
            <Card 
               key={idx} 
               variant="interactive" 
               className="p-6 flex items-center gap-4"
               onClick={() => item.path !== '#' && navigate(item.path)}
            >
               <div className={`p-3 rounded-full ${item.color}`}>
                  <item.icon size={24} />
               </div>
               <span className="font-bold text-gray-700">{item.title}</span>
            </Card>
         ))}
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">最近订单</h3>
            <Button variant="text" size="sm" onClick={() => navigate('/mall/buyer/orders')}>查看全部</Button>
         </div>
         <div className="space-y-4">
            {[1, 2].map(i => (
               <div key={i} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                     <span className="text-xs text-gray-500">订单号: 2025092500{i}</span>
                     <span className="text-xs text-[#FF9800] bg-orange-50 px-2 py-1 rounded-full">运输中</span>
                  </div>
                  <div className="flex gap-4 items-center">
                     <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        <img src={`https://picsum.photos/100/100?random=${i}`} alt="product" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">有机红富士苹果 (特级) 5kg</h4>
                        <p className="text-xs text-gray-400">数量: 1</p>
                     </div>
                     <div className="text-right">
                        <div className="font-bold">¥85.00</div>
                     </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                     <Button variant="ghost" size="sm">查看物流</Button>
                     <Button variant="solid-green" size="sm">确认收货</Button>
                  </div>
               </div>
            ))}
         </div>
      </Card>
    </div>
  );
};