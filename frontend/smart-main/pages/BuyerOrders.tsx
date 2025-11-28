import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/Common';
import { Search, Filter, Package } from 'lucide-react';
import { ordersList } from '../api/market';

const TABS = ['全部', '待付款', '待发货', '待收货', '待评价'];

export const BuyerOrders: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('全部');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
      ordersList().then((r: any) => {
        const list = r?.data || [];
        setOrders(Array.isArray(list) ? list : []);
      }).catch(() => setOrders([]));
  }, []);

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
         {orders.map((o) => (
            <Card key={i} className="p-0 overflow-hidden border border-gray-200">
               <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-sm text-gray-500 border-b border-gray-200">
                  <div className="flex gap-4">
                     <span>{o.create_time || ''}</span>
                     <span className="font-mono">订单号: {o.order_id}</span>
                     <span className="font-medium text-gray-700 hidden sm:inline">{o.seller_name || ''}</span>
                  </div>
                  <div className="text-[#FF9800] font-medium">
                     {o.order_status === 0 ? '待付款' : o.order_status === 1 ? '待发货' : o.order_status === 2 ? '运输中' : o.order_status === 4 ? '已完成' : '处理中'}
                  </div>
               </div>
               
               <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex items-center gap-4 flex-1 w-full cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/mall/buyer/order/${o.order_id}`)}>
                     <img src={`https://picsum.photos/100/100?random=${o.order_id}`} className="w-20 h-20 object-cover rounded bg-gray-200" alt="product" />
                     <div>
                        <h4 className="font-bold text-[#212121] mb-1">{o.product_name || ''}</h4>
                        <p className="text-sm text-gray-500">规格: {o.product_spec || ''}</p>
                     </div>
                  </div>
                  
                  <div className="text-center w-32 hidden md:block">
                     <div className="text-gray-500">¥{Number(o.unit_price || 0).toFixed(2)}</div>
                     <div className="text-gray-400 text-xs">x{o.quantity}</div>
                  </div>
                  
                  <div className="text-center w-32 border-l border-gray-100 pl-6 md:pl-0">
                     <div className="font-bold text-[#212121]">¥{Number(o.pay_amount || 0).toFixed(2)}</div>
                     <div className="text-xs text-gray-400">含运费 ¥0.00</div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-32">
                     {o.order_status === 1 && <Button variant="ghost" size="sm">提醒发货</Button>}
                     {o.order_status === 2 && (
                        <>
                           <Button variant="solid-green" size="sm">确认收货</Button>
                           <Button variant="ghost" size="sm" onClick={() => navigate(`/mall/buyer/logistics/${o.order_id}`)}>查看物流</Button>
                        </>
                     )}
                     {o.order_status === 4 && (
                        <>
                           <Button variant="ghost" size="sm" className="border-gray-300 text-gray-600" onClick={() => navigate(`/mall/buyer/review/publish/${o.order_id}`)}>评价晒单</Button>
                           <Button variant="text" size="sm" className="text-gray-500" onClick={() => navigate(`/mall/buyer/refund/${o.order_id}`)}>申请售后</Button>
                        </>
                     )}
                     <Button variant="text" size="sm" className="text-gray-500" onClick={() => navigate(`/mall/buyer/order/${o.order_id}`)}>订单详情</Button>
                  </div>
               </div>
            </Card>
         ))}
      </div>
    </div>
  );
};
