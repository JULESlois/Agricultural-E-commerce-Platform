import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/Common';
import { Search, Filter, Package } from 'lucide-react';

const TABS = ['全部', '待付款', '待发货', '待收货', '待评价'];

export const BuyerOrders: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('全部');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-[#212121]">我的订单</h1>
         <div className="relative">
            <input 
              type="text" 
              placeholder="搜索订单号/商品" 
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#4CAF50]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
         </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
         {TABS.map(tab => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-[#4CAF50]' : 'text-gray-500 hover:text-gray-700'
               }`}
            >
               {tab}
               {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4CAF50]"></div>}
            </button>
         ))}
      </div>

      {/* Order List */}
      <div className="space-y-4">
         {[1, 2, 3].map((i) => (
            <Card key={i} className="p-0 overflow-hidden border border-gray-200">
               <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-sm text-gray-500 border-b border-gray-200">
                  <div className="flex gap-4">
                     <span>2025-09-2{i} 14:30</span>
                     <span className="font-mono">订单号: 2025092{i}0088</span>
                     <span className="font-medium text-gray-700 hidden sm:inline">绿源果蔬合作社</span>
                  </div>
                  <div className="text-[#FF9800] font-medium">
                     {i === 1 ? '待发货' : i === 2 ? '运输中' : '已完成'}
                  </div>
               </div>
               
               <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex items-center gap-4 flex-1 w-full cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/mall/buyer/order/2025092${i}0088`)}>
                     <img src={`https://picsum.photos/100/100?random=${i}`} className="w-20 h-20 object-cover rounded bg-gray-200" alt="product" />
                     <div>
                        <h4 className="font-bold text-[#212121] mb-1">有机红富士苹果 (特级) 5kg</h4>
                        <p className="text-sm text-gray-500">规格: 5kg装</p>
                     </div>
                  </div>
                  
                  <div className="text-center w-32 hidden md:block">
                     <div className="text-gray-500">¥85.00</div>
                     <div className="text-gray-400 text-xs">x1</div>
                  </div>
                  
                  <div className="text-center w-32 border-l border-gray-100 pl-6 md:pl-0">
                     <div className="font-bold text-[#212121]">¥85.00</div>
                     <div className="text-xs text-gray-400">含运费 ¥0.00</div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-32">
                     {i === 1 && <Button variant="ghost" size="sm">提醒发货</Button>}
                     {i === 2 && (
                        <>
                           <Button variant="solid-green" size="sm">确认收货</Button>
                           <Button variant="ghost" size="sm" onClick={() => navigate(`/mall/buyer/logistics/2025092${i}0088`)}>查看物流</Button>
                        </>
                     )}
                     {i === 3 && (
                        <>
                           <Button variant="ghost" size="sm" className="border-gray-300 text-gray-600" onClick={() => navigate(`/mall/buyer/review/publish/2025092${i}0088`)}>评价晒单</Button>
                           <Button variant="text" size="sm" className="text-gray-500" onClick={() => navigate(`/mall/buyer/refund/2025092${i}0088`)}>申请售后</Button>
                        </>
                     )}
                     <Button variant="text" size="sm" className="text-gray-500" onClick={() => navigate(`/mall/buyer/order/2025092${i}0088`)}>订单详情</Button>
                  </div>
               </div>
            </Card>
         ))}
      </div>
    </div>
  );
};